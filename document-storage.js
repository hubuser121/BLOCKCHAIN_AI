console.log('document-storage.js loaded');

// This is a mock implementation for document storage.
// In a real-world scenario, you would use a database or cloud storage.
const storedDocuments = new Map();

export async function storeDocument(docId, file) {
    console.log('Storing document:', docId);
    return new Promise((resolve, reject) => {
        if (!file) {
            reject('No file provided');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            storedDocuments.set(docId, {
                content: event.target.result,
                type: file.type
            });
            console.log('Document stored successfully:', docId);
            resolve();
        };
        reader.onerror = (error) => {
            console.error('Error reading file:', error);
            reject(error);
        };
        reader.readAsDataURL(file); // Read the file as a data URL
    });
}

export async function getDocument(docId) {
    console.log('Retrieving document:', docId);
    return new Promise((resolve, reject) => {
        const storedDoc = storedDocuments.get(docId);
        if (storedDoc) {
            console.log('Document retrieved successfully:', docId);
            // Convert the data URL back to a Blob
            const blob = dataURLtoBlob(storedDoc.content);
            resolve(blob);
        } else {
            console.log('Document not found:', docId);
            reject('Document not found');
        }
    });
}

// Helper function to convert data URL to Blob
function dataURLtoBlob(dataURL) {
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
}
