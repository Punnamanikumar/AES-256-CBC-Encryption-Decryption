document.addEventListener('DOMContentLoaded', () => {
    const encryptBtn = document.getElementById('encrypt-btn');
    const decryptBtn = document.getElementById('decrypt-btn');
    
    // History arrays to store recent operations
    let encryptHistory = [];
    let decryptHistory = [];
    const MAX_HISTORY = 10;
    const HISTORY_LIFETIME = 5 * 60 * 1000; // 5 minutes in milliseconds

    // Toggle visibility functionality
    const setupToggle = (toggleBtnId, inputId) => {
        const toggleBtn = document.getElementById(toggleBtnId);
        const input = document.getElementById(inputId);
        
        toggleBtn.addEventListener('click', () => {
            if (input.type === 'password') {
                input.type = 'text';
                toggleBtn.textContent = '🙈';
            } else {
                input.type = 'password';
                toggleBtn.textContent = '👁️';
            }
        });
    };

    // Setup toggles for all key and IV fields
    setupToggle('toggle-encrypt-key', 'encrypt-key');
    setupToggle('toggle-encrypt-iv', 'encrypt-iv');
    setupToggle('toggle-decrypt-key', 'decrypt-key');
    setupToggle('toggle-decrypt-iv', 'decrypt-iv');

    // Dark mode functionality
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme on load
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggleBtn.textContent = '☀️';
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update button icon
        themeToggleBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        
        showToast(`Switched to ${newTheme} mode!`);
    });

    // Clear functionality
    document.getElementById('clear-encrypt').addEventListener('click', () => {
        document.getElementById('encrypt-input').value = '';
        document.getElementById('encrypt-key').value = '';
        document.getElementById('encrypt-iv').value = '';
        document.getElementById('encrypt-output').value = '';
        showToast('Encrypt section cleared!');
    });

    document.getElementById('clear-decrypt').addEventListener('click', () => {
        document.getElementById('decrypt-input').value = '';
        document.getElementById('decrypt-key').value = '';
        document.getElementById('decrypt-iv').value = '';
        document.getElementById('decrypt-output').value = '';
        showToast('Decrypt section cleared!');
    });

    // Clear everything functionality
    document.getElementById('clear-everything-btn').addEventListener('click', () => {
        // Clear all input fields
        document.getElementById('encrypt-input').value = '';
        document.getElementById('encrypt-key').value = '';
        document.getElementById('encrypt-iv').value = '';
        document.getElementById('encrypt-output').value = '';
        document.getElementById('decrypt-input').value = '';
        document.getElementById('decrypt-key').value = '';
        document.getElementById('decrypt-iv').value = '';
        document.getElementById('decrypt-output').value = '';
        
        // Clear all history and their timeouts
        encryptHistory.forEach(item => {
            if (item.timeoutId) {
                clearTimeout(item.timeoutId);
            }
        });
        decryptHistory.forEach(item => {
            if (item.timeoutId) {
                clearTimeout(item.timeoutId);
            }
        });
        
        // Reset history arrays
        encryptHistory = [];
        decryptHistory = [];
        
        // Update history displays
        updateHistoryDisplay('encrypt');
        updateHistoryDisplay('decrypt');
        
        showToast('Everything cleared!');
    });

    const validateInput = (input, key, iv) => {
        if (!input || input.trim() === '') {
            alert('Input cannot be empty.');
            return false;
        }
        if (!key || key.length !== 32) {
            alert('Key must be 32 characters long.');
            return false;
        }
        if (!iv || iv.length !== 16) {
            alert('IV must be 16 characters long.');
            return false;
        }
        return true;
    };

    const encrypt = async (text, key, iv) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            encoder.encode(key),
            { name: 'AES-CBC' },
            false,
            ['encrypt']
        );
        const encrypted = await crypto.subtle.encrypt(
            { name: 'AES-CBC', iv: encoder.encode(iv) },
            cryptoKey,
            data
        );
        return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
    };

    const decrypt = async (encryptedText, key, iv) => {
        const decoder = new TextDecoder();
        const encryptedData = Uint8Array.from(atob(encryptedText), c => c.charCodeAt(0));
        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(key),
            { name: 'AES-CBC' },
            false,
            ['decrypt']
        );
        const decrypted = await crypto.subtle.decrypt(
            { name: 'AES-CBC', iv: new TextEncoder().encode(iv) },
            cryptoKey,
            encryptedData
        );
        return decoder.decode(decrypted);
    };

    encryptBtn.addEventListener('click', async () => {
        const input = document.getElementById('encrypt-input').value;
        const key = document.getElementById('encrypt-key').value;
        const iv = document.getElementById('encrypt-iv').value;

        if (validateInput(input, key, iv)) {
            try {
                const encrypted = await encrypt(input, key, iv);
                document.getElementById('encrypt-output').value = encrypted;
                
                // Add to history
                addToHistory(encryptHistory, input, encrypted, 'encrypt');
            } catch (error) {
                alert('Encryption failed: ' + error.message);
            }
        }
    });

    decryptBtn.addEventListener('click', async () => {
        let input = document.getElementById('decrypt-input').value.trim();
        const key = document.getElementById('decrypt-key').value;
        const iv = document.getElementById('decrypt-iv').value;

        if (validateInput(input, key, iv)) {
            let encryptedValue = input;
            
            // Check if input looks like a complete JSON object
            if (input.trim().startsWith('{') && input.trim().endsWith('}')) {
                try {
                    // Try to parse as JSON and extract the encrypted value
                    const jsonInput = JSON.parse(input);
                    
                    // Check for common keys like "request" or "response"
                    if (jsonInput.request) {
                        encryptedValue = jsonInput.request;
                    } else if (jsonInput.response) {
                        encryptedValue = jsonInput.response;
                    } else {
                        // If it's a JSON object but doesn't have request/response, 
                        // get the first string value
                        const values = Object.values(jsonInput);
                        const firstStringValue = values.find(val => typeof val === 'string');
                        if (firstStringValue) {
                            encryptedValue = firstStringValue;
                        }
                    }
                } catch (e) {
                    // If JSON parsing fails, treat as plain text
                    encryptedValue = input.replace(/["',{}]/g, '').trim();
                }
            } else {
                // For plain text input, remove any unwanted characters (like the old behavior)
                encryptedValue = input.replace(/["',{}]/g, '').trim();
            }

            try {
                const decrypted = await decrypt(encryptedValue, key, iv);
                let formattedOutput;
                try {
                    const json = JSON.parse(decrypted);
                    formattedOutput = JSON.stringify(json, null, 4); // Format JSON
                } catch (e) {
                    formattedOutput = decrypted; // Not JSON, display as is
                }
                
                document.getElementById('decrypt-output').value = formattedOutput;
                
                // Add to history
                addToHistory(decryptHistory, input, formattedOutput, 'decrypt');
            } catch (error) {
                alert('Decryption failed: ' + error.message);
            }
        }
    });

    function showToast(message = 'Copied to clipboard!') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }

    // History management functions
    function addToHistory(historyArray, input, output, type) {
        const now = Date.now();
        const historyItem = {
            timestamp: new Date().toLocaleString(),
            createdAt: now,
            input: input.length > 50 ? input.substring(0, 47) + '...' : input,
            output: output.length > 50 ? output.substring(0, 47) + '...' : output,
            fullInput: input,
            fullOutput: output,
            type: type,
            timeoutId: null
        };
        
        // Set individual timeout for this item
        historyItem.timeoutId = setTimeout(() => {
            removeHistoryItem(historyArray, historyItem, type);
        }, HISTORY_LIFETIME);
        
        historyArray.unshift(historyItem);
        if (historyArray.length > MAX_HISTORY) {
            const removedItem = historyArray.pop();
            if (removedItem.timeoutId) {
                clearTimeout(removedItem.timeoutId);
            }
        }
        
        updateHistoryDisplay(type);
    }

    function removeHistoryItem(historyArray, itemToRemove, type) {
        const index = historyArray.findIndex(item => item.createdAt === itemToRemove.createdAt);
        if (index !== -1) {
            const removedItem = historyArray.splice(index, 1)[0];
            if (removedItem.timeoutId) {
                clearTimeout(removedItem.timeoutId);
            }
            updateHistoryDisplay(type);
        }
    }

    function updateHistoryDisplay(type) {
        const historyContainer = document.getElementById(type + '-history');
        const historyArray = type === 'encrypt' ? encryptHistory : decryptHistory;
        
        if (historyArray.length === 0) {
            historyContainer.innerHTML = '<p class="no-history">No ' + type + 'ion history yet</p>';
            return;
        }
        
        historyContainer.innerHTML = historyArray.map((item, index) => {
            const remainingTime = Math.max(0, HISTORY_LIFETIME - (Date.now() - item.createdAt));
            const totalSeconds = Math.ceil(remainingTime / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            
            let timeDisplay;
            if (totalSeconds <= 0) {
                timeDisplay = 'Expired';
            } else if (minutes > 0) {
                timeDisplay = `${minutes}:${seconds.toString().padStart(2, '0')} left`;
            } else {
                timeDisplay = `${seconds}s left`;
            }
            
            return `
                <div class="history-item" onclick="useHistoryItem('${type}', ${index})">
                    <div class="history-timestamp">${item.timestamp} <span class="time-remaining">(${timeDisplay})</span></div>
                    <div class="history-input">Input: ${item.input}</div>
                    <div class="history-output">Output: ${item.output}</div>
                    <button class="history-copy-btn" onclick="event.stopPropagation(); copyHistoryItem('${type}', ${index})" title="Copy output">📋</button>
                </div>
            `;
        }).join('');
    }

    window.useHistoryItem = function(type, index) {
        const historyArray = type === 'encrypt' ? encryptHistory : decryptHistory;
        const item = historyArray[index];
        
        if (!item) return; // Item might have been auto-removed
        
        if (type === 'encrypt') {
            document.getElementById('encrypt-input').value = item.fullInput;
            document.getElementById('encrypt-output').value = item.fullOutput;
        } else {
            document.getElementById('decrypt-input').value = item.fullInput;
            document.getElementById('decrypt-output').value = item.fullOutput;
        }
    };

    window.copyHistoryItem = function(type, index) {
        const historyArray = type === 'encrypt' ? encryptHistory : decryptHistory;
        const item = historyArray[index];
        
        if (!item) return; // Item might have been auto-removed
        
        navigator.clipboard.writeText(item.fullOutput).then(() => {
            showToast();
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    };

    // Update display every second for real-time countdown
    setInterval(() => {
        if (encryptHistory.length > 0) {
            updateHistoryDisplay('encrypt');
        }
        if (decryptHistory.length > 0) {
            updateHistoryDisplay('decrypt');
        }
    }, 1000); // Update every second for real-time countdown

    // Copy input field functionality
    document.getElementById('copy-encrypt-input').addEventListener('click', () => {
        const encryptInput = document.getElementById('encrypt-input').value;
        if (encryptInput) {
            navigator.clipboard.writeText(encryptInput).then(() => {
                showToast();
            }).catch(err => {
                console.error('Failed to copy:', err);
            });
        }
    });

    document.getElementById('copy-decrypt-input').addEventListener('click', () => {
        const decryptInput = document.getElementById('decrypt-input').value;
        if (decryptInput) {
            navigator.clipboard.writeText(decryptInput).then(() => {
                showToast();
            }).catch(err => {
                console.error('Failed to copy:', err);
            });
        }
    });

    // Paste input field functionality (NEW)
    document.getElementById('paste-encrypt-input').addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                document.getElementById('encrypt-input').value = text;
                showToast('Pasted from clipboard!');
            }
        } catch (err) {
            console.error('Failed to paste:', err);
            alert('Failed to paste from clipboard. Please make sure you have given permission to access clipboard.');
        }
    });

    document.getElementById('paste-decrypt-input').addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                document.getElementById('decrypt-input').value = text;
                showToast('Pasted from clipboard!');
            }
        } catch (err) {
            console.error('Failed to paste:', err);
            alert('Failed to paste from clipboard. Please make sure you have given permission to access clipboard.');
        }
    });

    // Copy output field functionality (EXISTING - kept as is)
    document.getElementById('copy-encrypt-output').addEventListener('click', () => {
        const encryptedOutput = document.getElementById('encrypt-output').value;
        if (encryptedOutput) {
            navigator.clipboard.writeText(encryptedOutput).then(() => {
                showToast();
            }).catch(err => {
                console.error('Failed to copy:', err);
            });
        }
    });

    document.getElementById('copy-decrypt-output').addEventListener('click', () => {
        const decryptedOutput = document.getElementById('decrypt-output').value;
        if (decryptedOutput) {
            navigator.clipboard.writeText(decryptedOutput).then(() => {
                showToast();
            }).catch(err => {
                console.error('Failed to copy:', err);
            });
        }
    });
});