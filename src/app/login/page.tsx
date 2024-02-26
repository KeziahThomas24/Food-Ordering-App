"use client"
import { FC, useState, ChangeEvent, FormEvent } from "react";
import { SignInResponse, signIn } from "next-auth/react";
import Image from "next/image";

interface LoginPageProps {}

const LoginPage: FC<LoginPageProps> = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginInProgress, setLoginInProgress] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleFormSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev. preventDefault();
    setLoginInProgress(true);
    setErrorMessage("");

    const result: SignInResponse = await signIn("credentials", {
      redirect: false, // Prevents redirect and returns a promise
      email, 
      password,
    }) as SignInResponse; // Cast the response to the SignInResponse type

    if (result.error) {
      setErrorMessage(result.error);
    } else if (result.url) {
      window.location.href = '/';
    } else {
      // Handle other cases or set a default error message
      setErrorMessage("An unknown error occurred.");
    }
  };

  const handleEmailChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setEmail(ev.target.value);
  };

  const handlePasswordChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setPassword(ev.target.value);
  };

  return (
    <section className="mt-8">
      <h1 className="text-center text-primary text-4xl mb-4">Login</h1>
      <form className="max-w-xs mx-auto" onSubmit={handleFormSubmit}>
        <input
          type="email"
          name="email"
          placeholder="email"
          value={email}
          disabled={loginInProgress}
          onChange={handleEmailChange}
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          value={password}
          disabled={loginInProgress}
          onChange={handlePasswordChange}
        />
        <button disabled={loginInProgress} type="submit">
          Login
        </button>
        <div className="my-4 text-center text-gray-500">
          or login with provider
        </div>
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="flex gap-4 justify-center"
        >
          <Image src={"/google.png"} alt={""} width={24} height={24} />
          Login with google
        </button>
      </form>
    </section>
  );
};

export default LoginPage;