const debugMode = true; // Set this to true to enable debug mode

async function generateKeyPair() {
    try {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const passphrase = document.getElementById('passphrase').value;

        const { privateKey, publicKey } = await openpgp.generateKey({
            type: 'ecc', // Type of the key: ECC (Elliptic Curve)
            curve: 'curve25519', // Curve used
            userIDs: [{ name: name, email: email }],
            passphrase: passphrase
        });

        document.getElementById('generatedPublicKey').value = publicKey;
        document.getElementById('generatedPrivateKey').value = privateKey;
    } catch (error) {
        if (debugMode) {
            alert('Error generating key pair: ' + error.message);
        }
        console.error('Error generating key pair:', error);
    }
}

async function encryptMessage() {
    try {
        const message = document.getElementById('message').value;
        const publicKeyArmored = document.getElementById('publicKey').value;

        const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

        const encrypted = await openpgp.encrypt({
            message: await openpgp.createMessage({ text: message }),
            encryptionKeys: publicKey
        });

        document.getElementById('encryptedMessage').value = encrypted;
    } catch (error) {
        if (debugMode) {
            alert('Error encrypting message: ' + error.message);
        }
        console.error('Error encrypting message:', error);
    }
}

async function decryptMessage() {
    try {
        const encryptedMessage = document.getElementById('encryptedMessageToDecrypt').value;
        const privateKeyArmored = document.getElementById('privateKey').value;
        const passphrase = document.getElementById('decryptPassphrase').value;

        const privateKey = await openpgp.decryptKey({
            privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
            passphrase
        });

        const message = await openpgp.readMessage({ armoredMessage: encryptedMessage });

        const { data: decrypted } = await openpgp.decrypt({
            message,
            decryptionKeys: privateKey
        });

        document.getElementById('decryptedMessage').value = decrypted;
    } catch (error) {
        if (debugMode) {
            alert('Error decrypting message: ' + error.message);
        }
        console.error('Error decrypting message:', error);
    }
}
