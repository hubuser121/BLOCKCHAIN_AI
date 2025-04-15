import { state } from './state.js';
import { mockBlockchain } from './blockchain.js';
import { realAI } from './classification.js';
import { setButtonLoading, showResultMessage, displayDocument } from './dom-utils.js';
import { showPage } from './navigation.js';
import { validateFileType } from './validation.js';

console.log('event-listeners.js loaded');

export function setupEventListeners() {
    // Prevent wheel zoom
    document.body.addEventListener('wheel', e => { if (!e.ctrlKey) return; e.preventDefault(); return }, { passive: false });

    // Setup navigation
    document.getElementById('loginBtn').addEventListener('click', () => showPage('login'));
    document.getElementById('verifyPageBtn').addEventListener('click', () => showPage('verify'));
    document.getElementById('adminLogoutBtn').addEventListener('click', () => {
        state.isLoggedIn = false;
        showPage('login');
    });

    // Setup login form
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === state.adminCredentials.username && password === state.adminCredentials.password) {
            state.isLoggedIn = true;
            document.getElementById('loginError').classList.add('hidden');
            showPage('admin');
        } else {
            showResultMessage('loginError', 'error', '<p><strong>Invalid credentials!</strong></p><p>Please check your username and password.</p>');
        }
    });

    // Handle document upload
    document.getElementById('uploadForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!state.isLoggedIn) {
            showResultMessage('uploadResult', 'error', '<p><strong>Authentication Required</strong></p><p>Please login as an admin to upload documents.</p>');
            return;
        }
        
        setButtonLoading('uploadBtn', true);
        
        try {
            const adminName = document.getElementById('adminName').value;
            const file = document.getElementById('documentFile').files[0];
            
            if (!file) {
                throw new Error('Please select a document to upload');
            }
          
            // Dynamically import validateFileType
            const { validateFileType } = await import('./validation.js');

            if (!validateFileType()) {
                setButtonLoading('uploadBtn', false);
                return;
            }

            const reader = new FileReader();
            reader.onload = async (event) => {
                const fileContent = event.target.result; // This is the actual file data
              
                // Mock AI verification
                const aiResult = await realAI.classifyDocument(file);
                // Generate mock blockchain address
                const blockchainAddress = '0x' + Math.random().toString(36).substring(2, 15);
                const docId = `DOC${Date.now()}`;

                if (aiResult.isReal) {
                    // Add to blockchain if AI classifies as real
                    try {
                        await mockBlockchain.addDocument(docId, adminName, 'sha256_' + Date.now(), aiResult.confidence, file, blockchainAddress);

                        showResultMessage('uploadResult', 'success', `
                            <p><strong>Document Verified Successfully!</strong></p>
                            <p>Document ID: ${docId}</p>
                            <p>AI Classification: ${aiResult.label}</p>
                            <p>Confidence Score: ${aiResult.confidence}%</p>
                            <p>Status: Registered on blockchain</p>
                            <div class="mt-2 p-2 bg-blue-50 rounded">
                                <p class="text-sm">Share this Document ID with anyone who needs to verify this document.</p>
                            </div>
                        `);
                    } catch (error) {
                        showResultMessage('uploadResult', 'error', `<p><strong>Error storing document:</strong> ${error}</p>`);
                    }
                } else {
                    showResultMessage('uploadResult', 'error', `
                        <p><strong>Document Verification Failed!</strong></p>
                        <p>AI Classification: ${aiResult.label}</p>
                        <p>Confidence Score: ${aiResult.confidence}%</p>
                        <p>The document appears to be potentially fraudulent and was not registered on the blockchain.</p>
                    `);
                }
              setButtonLoading('uploadBtn', false);
            };
            reader.onerror = (error) => {
                showResultMessage('uploadResult', 'error', `<p><strong>Error reading file:</strong> ${error}</p>`);
                setButtonLoading('uploadBtn', false);
            };
            reader.readAsArrayBuffer(file); // Read the file as ArrayBuffer
        } catch (error) {
            showResultMessage('uploadResult', 'error', `<p><strong>Error:</strong> ${error.message}</p>`);
            setButtonLoading('uploadBtn', false);
        }
    });

    // Handle document verification
    document.getElementById('verifyForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        setButtonLoading('verifyBtn', true);
        
        try {
            const docId = document.getElementById('docId').value;
            const doc = await mockBlockchain.verifyDocument(docId);
            
            setTimeout(() => {
                if (doc) {
                    showResultMessage('verifyResult', 'success', `
                        <p><strong>Document Verified!</strong></p>
                        <p>Uploader: ${doc.name}</p>
                        <p>Timestamp: ${new Date(doc.timestamp).toLocaleString()}</p>
                        <p>Status: ${doc.verified ? 'Valid' : 'Invalid'}</p>
                        <p>Confidence Score: ${doc.aiScore}%</p>
                        <div class="mt-2 p-2 bg-green-50 rounded">
                            <p class="text-sm">✓ This document has been verified on the blockchain and is authentic.</p>
                        </div>
                    `);
                  displayDocument(doc.fileContent, 'documentContent', doc.blockchainAddress);
                } else {
                    showResultMessage('verifyResult', 'warning', `
                        <p><strong>Document Not Found</strong></p>
                        <p>No document exists with the provided ID (${docId}).</p>
                        <p>Possible reasons:</p>
                        <ul class="list-disc pl-5 mt-2">
                            <li>The document ID is incorrect</li>
                            <li>The document has not been registered</li>
                            <li>The document was rejected during verification</li>
                        </ul>
                    `);
                  document.getElementById('documentDisplay').classList.add('hidden');
                }
                setButtonLoading('verifyBtn', false);
            }, 1000);
        } catch (error) {
            showResultMessage('verifyResult', 'error', `<p><strong>Error:</strong> ${error.message}</p>`);
            setButtonLoading('verifyBtn', false);
        }
    });
}
