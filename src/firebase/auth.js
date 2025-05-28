import { auth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { createUser } from './users';

export const doCreateUserWithEmailAndPassword = async (email, password, name) => {
    try {
        console.log("Attempting to create user with email:", email);
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User created successfully in Firebase Auth:", userCredential.user.uid);
        
        // Create user in Firestore
        await createUser(userCredential.user.uid, email, name);
        console.log("User data saved to Firestore");
        
        return userCredential;
    } catch (error) {
        console.error("Error creating user:", error.code, error.message);
        // Provide more user-friendly error messages
        if (error.code === 'auth/email-already-in-use') {
            throw new Error('This email is already registered. Please try logging in instead.');
        } else if (error.code === 'auth/weak-password') {
            throw new Error('Password is too weak. Please use a stronger password.');
        } else if (error.code === 'auth/invalid-email') {
            throw new Error('Invalid email address. Please check your email.');
        } else if (error.code === 'auth/configuration-not-found') {
            throw new Error('Authentication service is not properly configured. Please contact support.');
        } else {
            throw error;
        }
    }
};

export const doSignInWithEmailAndPassword = async (email, password) => {
    try {
        console.log("Attempting to sign in user with email:", email);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User signed in successfully:", userCredential.user.uid);
        return userCredential;
    } catch (error) {
        console.error("Error signing in:", error.code, error.message);
        // Provide more user-friendly error messages
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            throw new Error('Invalid email or password. Please try again.');
        } else if (error.code === 'auth/too-many-requests') {
            throw new Error('Too many failed login attempts. Please try again later.');
        } else if (error.code === 'auth/configuration-not-found') {
            throw new Error('Authentication service is not properly configured. Please contact support.');
        } else {
            throw error;
        }
    }
};

export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        console.log("Attempting to sign in with Google");
        const result = await signInWithPopup(auth, provider);
        
        // Create or update user in Firestore
        const { user } = result;
        console.log("Google sign-in successful:", user.uid);
        await createUser(user.uid, user.email, user.displayName || 'Google User');
        console.log("Google user data saved to Firestore");
        
        return result;
    } catch (error) {
        console.error("Error signing in with Google:", error.code, error.message);
        if (error.code === 'auth/popup-closed-by-user') {
            throw new Error('Google sign-in was cancelled. Please try again.');
        } else if (error.code === 'auth/configuration-not-found') {
            throw new Error('Authentication service is not properly configured. Please contact support.');
        } else {
            throw error;
        }
    }
};

export const doSignOut = () => {
    console.log("Signing out user");
    return signOut(auth);
};

