# 🔐 AES-256-CBC Encryption Decryption Tool

A modern, feature-rich web application for AES-256-CBC encryption and decryption with an intuitive user interface, dark mode support, and comprehensive security features.

## ✨ Features

### 🔒 **Core Encryption**
- **AES-256-CBC Encryption**: Industry-standard encryption algorithm
- **Secure Key Management**: 32-character key requirement (256-bit)
- **Initialization Vector**: 16-character IV for enhanced security
- **JSON Support**: Smart detection and extraction of encrypted values from JSON objects

### 🎨 **User Interface**
- **Dual Panel Layout**: Side-by-side encrypt and decrypt sections
- **Dark/Light Mode**: Toggle between themes with persistent preference
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations

### 🛠️ **Productivity Features**
- **Copy/Paste Integration**: One-click copy and paste buttons for all fields
- **Password Field Toggles**: Show/hide functionality for keys and IVs
- **Clear Functions**: Individual section clearing and global clear-all option
- **Smart Input Handling**: Automatic cleanup of malformed JSON inputs

### 📊 **History Management**
- **Operation History**: Tracks last 10 encryption/decryption operations
- **Real-time Countdown**: Shows remaining time before auto-deletion
- **Auto-Expiry**: Automatically clears sensitive data after 5 minutes
- **Quick Reuse**: Click history items to reload previous operations

### 🔧 **Advanced Features**
- **Toast Notifications**: User-friendly feedback for all actions
- **Memory Management**: Proper cleanup of timers and sensitive data
- **Browser Compatibility**: Works across all modern browsers
- **No External Dependencies**: Pure vanilla JavaScript implementation

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (recommended) or direct file opening

### Installation

1. **Clone or Download**
   ```bash
   git clone <repository-url>
   cd encrypt-decrypt-main
   ```

2. **Serve Locally** (Recommended)
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Access Application**
   Open your browser and navigate to `http://localhost:8000`

### Direct File Access
You can also open `index.html` directly in your browser, though some features may be limited due to CORS restrictions.

## 📖 Usage Guide

### Basic Encryption
1. **Enter Data**: Type or paste your text/JSON in the encrypt input field
2. **Set Credentials**: Enter a 32-character key and 16-character IV
3. **Encrypt**: Click the "Encrypt" button
4. **Copy Result**: Use the copy button to save the encrypted output

### Basic Decryption
1. **Enter Encrypted Data**: Paste encrypted text in the decrypt input field
2. **Set Credentials**: Enter the same key and IV used for encryption
3. **Decrypt**: Click the "Decrypt" button
4. **View Result**: The decrypted data will appear in the output field

### JSON Object Handling
The tool automatically detects and processes JSON objects:

```json
{"request": "DxGWwT7n8Jv06AnH8QRBPQ=="}
{"response": "DxGWwT7n8Jv06AnH8QRBPQ=="}
```

It will extract and decrypt only the encrypted value, ignoring the JSON structure.

### Advanced Features

#### History Management
- View recent operations in the history sections
- Click any history item to reload its data
- Copy outputs directly from history
- Watch real-time countdown timers

#### Theme Switching
- Click the 🌙/☀️ button to toggle dark/light mode
- Your preference is automatically saved

#### Bulk Operations
- Use the 🗑️ button to clear everything at once
- Individual section clearing with red "Clear All" buttons

## 🔧 Technical Specifications

### Encryption Details
- **Algorithm**: AES-256-CBC
- **Key Size**: 256 bits (32 characters)
- **Block Size**: 128 bits (standard AES)
- **IV Size**: 128 bits (16 characters)
- **Output Format**: Base64 encoded

### Browser Compatibility
- **Chrome**: ✅ Full support
- **Firefox**: ✅ Full support
- **Safari**: ✅ Full support
- **Edge**: ✅ Full support
- **Mobile Browsers**: ✅ Responsive design

### Security Features
- **No Server Communication**: All operations performed locally
- **Auto-Clear History**: Sensitive data expires after 5 minutes
- **Memory Management**: Proper cleanup of sensitive variables
- **Secure Input Handling**: Protection against common input vulnerabilities

## 📁 Project Structure

```
encrypt-decrypt-main/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and themes
├── script.js           # JavaScript functionality
└── README.md           # This documentation
```

## 🎯 Use Cases

### Development & Testing
- **API Testing**: Encrypt/decrypt API payloads
- **Data Validation**: Test encryption implementations
- **Security Testing**: Verify encrypted data handling

### Data Security
- **Sensitive Data**: Encrypt confidential information
- **File Contents**: Secure text-based file contents
- **Configuration**: Encrypt configuration values

### Educational
- **Cryptography Learning**: Understand AES encryption
- **Security Demonstrations**: Show encryption concepts
- **Development Training**: Learn web cryptography APIs

## ⚠️ Security Considerations

### Best Practices
- **Use Strong Keys**: Generate cryptographically secure 32-character keys
- **Unique IVs**: Use different IVs for each encryption operation
- **Secure Storage**: Never store keys and encrypted data together
- **Regular Rotation**: Rotate keys periodically

### Limitations
- **Client-Side Only**: All operations performed in browser
- **Key Management**: Manual key handling required
- **No Key Derivation**: Uses raw keys without derivation functions

## 🔮 Future Enhancements

### Planned Features
- [ ] Key derivation functions (PBKDF2, Argon2)
- [ ] File encryption support
- [ ] Bulk operations
- [ ] Export/import functionality
- [ ] Audit logging

### Technical Improvements
- [ ] Web Workers for large file processing
- [ ] Progressive Web App (PWA) support
- [ ] Offline functionality
- [ ] Enhanced mobile experience

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch
3. **Commit** your changes
4. **Push** to the branch
5. **Open** a Pull Request

### Development Setup
```bash
# Clone the repository
git clone <repository-url>
cd encrypt-decrypt-main

# Make your changes
# Test thoroughly in multiple browsers
# Ensure responsive design works
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

### Common Issues

**Q: Decryption fails with "Decryption failed" error**
A: Ensure the key and IV are exactly the same as used for encryption. Check for extra spaces or characters.

**Q: Dark mode input fields show white background**
A: This has been fixed in the latest version. Update your browser or clear cache.

**Q: History items disappear**
A: History items automatically expire after 5 minutes for security. This is by design.

**Q: Copy/paste doesn't work**
A: Ensure you're using HTTPS or localhost. Clipboard API requires secure context.

### Getting Help
- Check the browser console for error messages
- Verify key and IV lengths (32 and 16 characters respectively)
- Ensure you're using a modern browser
- Try clearing browser cache and cookies

## 🎉 Acknowledgments

- Built with vanilla JavaScript and Web Crypto API
- Uses modern CSS custom properties for theming
- Inspired by security-first design principles
- Thanks to the web development community for best practices

---

**🔐 Secure by Design | 🌙 Dark Mode Ready | 📱 Mobile Friendly**
