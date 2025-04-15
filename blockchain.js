console.log('blockchain.js loaded');

import { storeDocument, getDocument } from './document-storage.js';

export const mockBlockchain = {
    documents: new Map(),
    documentAddresses: new Map(),

    addDocument: async function(docId, name, hash, aiScore, file, blockchainAddress) {
        console.log('Adding document to blockchain:', docId);
        try {
            // Store the document using the new module
            await storeDocument(docId, file);

            this.documents.set(docId, {
                name,
                hash,
                verified: true,
                aiScore: aiScore,
                timestamp: new Date().toISOString(),
                blockchainAddress: blockchainAddress // Store the blockchain address
            });
            this.documentAddresses.set(docId, blockchainAddress);
            console.log('Document added successfully:', docId);
            return true;
        } catch (error) {
            console.error('Error storing document:', error);
            throw error; // Re-throw the error to be handled by the caller
        }
    },

    verifyDocument: async function(docId) {
        console.log('Verifying document:', docId);
        const docInfo = this.documents.get(docId) || null;
        if (docInfo) {
            try {
                // Retrieve the document content using the new module
                const fileContent = await getDocument(docId);
                const blockchainAddress = docInfo.blockchainAddress || 'Not Available';
                console.log('Document verified successfully:', docId);
                return { ...docInfo, fileContent, blockchainAddress };
            } catch (error) {
                console.error('Error retrieving document:', error);
                return null;
            }
        }
        console.log('Document not found:', docId);
        return null;
    }
};
