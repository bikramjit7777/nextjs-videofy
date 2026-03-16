"use client";
import { useRouter } from "next/navigation";
import React, {useState} from "react";

function RegisterPage() {

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ confirmPassword, setConfirmPassword ] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            })
            const data = await res.json();
            if(!res.ok) {
                throw new Error(data.error || "Registration failed");
                return;
            }
            router.push("/login");

        } catch (error) {
            console.error("Registration error:", error);
            alert("An error occurred during registration");
        }
    }
 
    return <div>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
            <div>
                <label>Email:</label>   
                <input 
                    type="email" 
                    value={email}   
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <label>Password:</label>
                <input 
                    type="password" 
                    value={password} 
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div>
                <label>Confirm Password:</label>
                <input 
                    type="password" 
                    value={confirmPassword} 
                    placeholder="Confirm Password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>
            <button type="submit">Register</button>
        </form>
        <div>
            <p>Already have an account? <a href="/login">Login here</a></p>
        </div>

    </div>
}

export default RegisterPage;