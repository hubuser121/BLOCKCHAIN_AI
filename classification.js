console.log('classification.js loaded');

export const realAI = {
    async classifyDocument(file) {
        console.log('Classifying document with AI:', file);
        return new Promise(resolve => {
            setTimeout(() => {
                const isReal = Math.random() > 0.2;
                const confidence = isReal ? (Math.random() * 20 + 80).toFixed(2) : (Math.random() * 30 + 40).toFixed(2);
                const result = { isReal, confidence, label: isReal ? 'Real' : 'Fake' };
                console.log('AI classification result:', result);
                resolve(result);
            }, 1500);
        });
    }
};
