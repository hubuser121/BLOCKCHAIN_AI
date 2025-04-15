console.log('navigation.js loaded');

export function showPage(pageName) {
    console.log('Showing page:', pageName);
    // Hide all pages
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('adminPage').classList.add('hidden');
    document.getElementById('verifyPage').classList.add('hidden');
    
    // Show requested page
    document.getElementById(`${pageName}Page`).classList.remove('hidden');
}
