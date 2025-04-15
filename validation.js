console.log('validation.js loaded');

export function validateFileType() {
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
