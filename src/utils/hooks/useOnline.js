import { BrowserRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

import { auth, db } from "../../config/firebase";

export const useOnline = () => {
    const [user] = useAuthState(auth);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const updateStatus = async () => {
            console.log("updateStatus : ", isOnline)
            setIsOnline(navigator.onLine);
            if (user) {
                const userRef = doc(db, "users", user?.uid);
                const userSnap = await getDoc(userRef);
        
                if (userSnap.exists()) {
                    await updateDoc(userRef, {
                    isOnline: isOnline,
                    });
                }
            }
        }

    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    return () => {
        window.removeEventListener("online", updateStatus);
        window.removeEventListener("offline", updateStatus);
    };
    }, []);

    return isOnline;
};