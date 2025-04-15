// System State
const state = {
    isLoggedIn: false,
    currentPage: 'verify', // 'login', 'admin', 'verify'
    adminCredentials: {
        username: 'TEAM_5',
        password: 'PROJECT'
    }
};

// Mock blockchain connection (In production, use actual Web3/Ethers connection)
const mockBlockchain = {
    documents: new Map(),
    storedFiles: new Map(), // Store actual file content
    // Store blockchain addresses
    documentAddresses: new Map(),

    addDocument: function(docId, name, hash, aiScore, fileContent, blockchainAddress) {
        console.log('Adding document to blockchain:', docId);
        this.documents.set(docId, {
            name,
            hash,
            verified: true,
            aiScore: aiScore,
            timestamp: new Date().toISOString(),
            blockchainAddress: blockchainAddress // Store the blockchain address
        });
        this.storedFiles.set(docId, fileContent); // Store the file content
        this.documentAddresses.set(docId, blockchainAddress);
        console.log('Document added successfully:', docId);
        return true;
    },
    verifyDocument: function(docId) {
        console.log('Verifying document:', docId);
        const docInfo = this.documents.get(docId) || null;
        if (docInfo) {
            const fileContent = this.storedFiles.get(docId) || null;
            const blockchainAddress = docInfo.blockchainAddress || 'Not Available'; // Retrieve address from docInfo
            console.log('Document verified successfully:', docId);
            return { ...docInfo, fileContent, blockchainAddress }; // Return both doc info, file content, and address
        }
        console.log('Document not found:', docId);
        return null;
    }
};

// ** Placeholder for Real AI Model Integration **
const realAI = {
    async classifyDocument(file) {
        console.log('Classifying document with AI:', file);
        // In a real environment, this would:
        // 1. Send the file to an AI model (e.g., via API).
        // 2. Receive a classification result.
        // 3. Return the result.

        // Simulate API call and response
        return new Promise(resolve => {
            setTimeout(() => {
                // Replace this with actual AI model integration
                const isReal = Math.random() > 0.2;
                const confidence = isReal ?
                    (Math.random() * 20 + 80).toFixed(2) :
                    (Math.random() * 30 + 40).toFixed(2);

                const result = {
                    isReal,
                    confidence,
                    label: isReal ? 'Real' : 'Fake'
                };
                console.log('AI classification result:', result);
                resolve(result);
            }, 1500);
        });
    }
};

// Mock AI model
const mockAI = {
    classifyDocument(file) {
        return new Promise((resolve) => {
            // Simulate AI processing time
            setTimeout(() => {
                const isReal = Math.random() > 0.2;
                const confidence = isReal ? 
                    (Math.random() * 20 + 80).toFixed(2) : 
                    (Math.random() * 30 + 40).toFixed(2);
            
                resolve({
                    isReal,
                    confidence,
                    label: isReal ? 'Real' : 'Fake'
                });
            }, 1500);
        });
    }
};

// Navigation functions
function showPage(pageName) {
    console.log('Showing page:', pageName);
    // Hide all pages
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('adminPage').classList.add('hidden');
    document.getElementById('verifyPage').classList.add('hidden');
    
    // Show requested page
    document.getElementById(`${pageName}Page`).classList.remove('hidden');
    state.currentPage = pageName;
}

// UI Helper Functions
function setButtonLoading(buttonId, isLoading) {
    console.log('Setting button loading state:', buttonId, isLoading);
    const button = document.getElementById(buttonId);
    const originalText = button.getAttribute('data-original-text') || button.innerHTML;
    
    if (isLoading) {
        button.setAttribute('data-original-text', originalText);
        button.innerHTML = `<span class="loading-spinner"></span> Processing...`;
        button.disabled = true;
    } else {
        button.innerHTML = originalText;
        button.disabled = false;
    }
}

function showResultMessage(elementId, type, message) {
    console.log('Showing result message:', elementId, type, message);
    const element = document.getElementById(elementId);
    element.className = 'mt-4 p-4 rounded-md';
    
    if (type === 'success') {
        element.classList.add('bg-green-100', 'text-green-700');
    } else if (type === 'error') {
        element.classList.add('bg-red-100', 'text-red-700');
    } else if (type === 'warning') {
        element.classList.add('bg-yellow-100', 'text-yellow-700');
    } else if (type === 'info') {
        element.classList.add('bg-blue-100', 'text-blue-700');
    }
    
    element.innerHTML = message;
    element.classList.remove('hidden');
}

function displayDocument(fileContent, elementId, blockchainAddress) {
    console.log('Displaying document:', elementId, blockchainAddress);
    const documentContentDiv = document.getElementById(elementId);
    if (!documentContentDiv) {
        console.error('Element with id "${elementId}" not found');
        return;
    }

    documentContentDiv.innerHTML = '';

    if (typeof fileContent === 'string') {
        // Display as text if it's a string (e.g., text-based documents)
        documentContentDiv.textContent = fileContent;
    } else if (fileContent instanceof Blob) {
        // Handle image or PDF Blobs
        if (fileContent.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(fileContent);
            img.classList.add('max-w-full', 'h-auto');
            documentContentDiv.appendChild(img);
        } else if (fileContent.type === 'application/pdf') {
            const object = document.createElement('object');
            object.data = URL.createObjectURL(fileContent);
            object.type = 'application/pdf';
            object.width = '100%';
            object.height = '500px';

            const embed = document.createElement('embed');
            embed.src = URL.createObjectURL(fileContent);
            embed.type = 'application/pdf';
            object.appendChild(embed);
            documentContentDiv.appendChild(object);
        } else {
            documentContentDiv.textContent = 'Unsupported document type.';
        }
    } else {
        documentContentDiv.textContent = 'No document to display.';
    }
  
    // Display blockchain address
    const blockchainAddressDiv = document.getElementById('blockchainAddress');
     if (blockchainAddressDiv) {
        blockchainAddressDiv.textContent = `Blockchain Address: ${blockchainAddress}`;
    } else {
        console.error('Element with id "blockchainAddress" not found');
    }

    document.getElementById('documentDisplay').classList.remove('hidden');
}

function validateFileType() {
    const fileInput = document.getElementById('documentFile');
    const filePath = fileInput.value;
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.pdf)$/i;

    if (!allowedExtensions.exec(filePath)) {
        alert('Invalid file type. Please upload only scanned documents or marksheets (JPEG, JPG, PNG, PDF).');
        fileInput.value = '';
        return false;
    } else {
        return true;
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Prevent wheel zoom
    document.body.addEventListener('wheel', e => { if (!e.ctrlKey) return; e.preventDefault(); return }, { passive: false });

    // Show the verify page by default
    showPage('verify');
    
    // Setup navigation
    document.getElementById('loginBtn').addEventListener('click', () => {
        showPage('login');
    });
    
    document.getElementById('verifyPageBtn').addEventListener('click', () => {
        showPage('verify');
    });
    
    document.getElementById('adminLogoutBtn').addEventListener('click', () => {
        state.isLoggedIn = false;
        showPage('login');
    });
    
    // Setup login form
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username === state.adminCredentials.username && 
            password === state.adminCredentials.password) {
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
                    mockBlockchain.addDocument(docId, adminName, 'sha256_' + Date.now(), aiResult.confidence, file, blockchainAddress);

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
});
