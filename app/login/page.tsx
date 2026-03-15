"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, {useState} from "react";  

function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        })

        if(result?.error) {
            alert("Login failed: " + result.error);
        } else {
            router.push("/");
        }

    }

    return (<div>
        <h1>Login</h1>  
        <form onSubmit={handleSubmit}>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required        
                />
            </div>
            <div>
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required        
                />
            </div>
            <button type="submit">Login</button>
        </form>
        <div>
            <p>Don't have an account? <a href="/register">Register here</a></p>
        </div>

    </div>)
}
export default LoginPage;