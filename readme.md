# FreshTrack - Expiry Tracker

FreshTrack is a smart food expiry tracking application that helps reduce food waste by scanning grocery receipts, tracking expiration dates, and suggesting recipes based on items about to expire.

## 🌟 Features

- **Receipt Scanning**: Upload and scan grocery receipts to automatically extract items
- **Expiry Tracking**: Get alerts for items nearing expiration
- **Recipe Suggestions**: Receive recipe recommendations based on expiring ingredients
- **User Authentication**: Secure login and signup functionality
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Tech Stack

- **Frontend**: React 19.1.0
- **UI Framework**: Material UI 6.4.7
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **OCR Technology**: Tesseract.js for receipt scanning
- **Animations**: Framer Motion
- **Routing**: React Router 7.3.0

## 📋 Prerequisites

- Node.js (latest LTS version)
- pnpm package manager
- Firebase account
- Google API key (for Gemini AI integration)

## 🔧 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/expiry-tracker.git
   cd expiry-tracker
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_GEMINI_API_KEY=your_gemini_api_key
   ```

4. Start the development server:
   ```bash
   pnpm start
   ```

## 🏗️ Project Structure

```
expiry-tracker/
├── public/
│   ├── index.html          # Main HTML template
│   └── manifest.json       # PWA manifest
├── src/
│   ├── components/
│   │   ├── Dashboard.js     # Main dashboard component
│   │   ├── FileUpload.js    # Receipt upload & scanning
│   │   ├── HomePage.js      # Landing page
│   │   ├── LoginPage.js     # Authentication
│   │   ├── StorageDebug.js  # Storage debugging utility
│   │   └── UploadPage.js    # Receipt processing page
│   ├── contexts/
│   │   └── authContext.js   # Authentication context
│   ├── firebase/
│   │   └── firebase.js      # Firebase configuration
│   ├── App.js               # Main app component
│   └── index.js             # Entry point
├── package.json
└── README.md
```

## 📱 Usage

1. **Create an Account**: Sign up with your email or use Google authentication
2. **Dashboard View**: After logging in, you'll see your dashboard with items sorted by expiration date
3. **Scan a Receipt**: Click on "Scan Receipt" to upload a photo of your grocery receipt
4. **Review Items**: Confirm the extracted items and their expiry dates
5. **Track Expiry**: Monitor your pantry items through the dashboard
6. **Get Recipes**: Click on "Get Recipes" for items nearing expiration to see cooking suggestions

## 🛠️ Available Scripts

- `pnpm start`: Runs the app in development mode
- `pnpm build`: Builds the app for production
- `pnpm test`: Runs the test suite
- `pnpm eject`: Ejects from Create React App
- `pnpm fix-cors`: Updates Firebase Storage CORS configuration

## 🔧 Firebase Storage Setup

If you encounter CORS issues with Firebase Storage, run:
```bash
pnpm fix-cors
```

This applies the CORS configuration to allow file uploads from your application.

## 🚧 Troubleshooting

### Receipt Scanning Issues
- Ensure receipt images are clear and well-lit
- Text should be clearly visible and not blurred
- Supported formats: JPG, PNG, WebP

### Authentication Problems
- Verify Firebase configuration in your `.env` file
- Check that Firebase Authentication is enabled in your Firebase console
- Ensure your domain is added to authorized domains

### Storage Upload Errors
- Confirm Firebase Storage rules allow authenticated users to upload
- Check CORS configuration using the `pnpm fix-cors` command
- Verify storage bucket exists and is properly configured

## 🎯 Key Components

- **[FileUpload.js](src/components/FileUpload.js)**: Handles receipt image upload and OCR processing
- **[StorageDebug.js](src/components/StorageDebug.js)**: Utility for testing Firebase Storage connectivity
- **[Dashboard.js](src/components/Dashboard.js)**: Main user interface for viewing tracked items

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [Material UI](https://mui.com/)
- [Firebase](https://firebase.google.com/)
- [Tesseract.js](https://tesseract.projectnaptha.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Google Gemini AI](https://ai.google.dev/)

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.
