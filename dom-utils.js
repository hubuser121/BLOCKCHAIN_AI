console.log('dom-utils.js loaded');

export function setButtonLoading(buttonId, isLoading) {
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

export function showResultMessage(elementId, type, message) {
    console.log('Showing result message:', elementId, type, message);
    const element = document.getElementById(elementId);
    // Check if the element exists before trying to modify it
    if (element) {
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
    } else {
        console.error('Element with id "${elementId}" not found');
    }
}

export function displayDocument(fileContent, elementId, blockchainAddress) {
    console.log('Displaying document:', elementId, blockchainAddress);
    const documentContentDiv = document.getElementById(elementId);
    if (!documentContentDiv) {
        console.error('Element with id "${elementId}" not found');
        return;
    }

    documentContentDiv.innerHTML = '';

    if (typeof fileContent === 'string') {
        documentContentDiv.textContent = fileContent;
    } else if (fileContent instanceof Blob) {
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
