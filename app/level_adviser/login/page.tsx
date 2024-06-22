"use client";

import LALoginForm from "@/components/AuthComponents/LALoginForm";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const LoginPage = () => {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <section className="landing-page">
      <div className="landing-page__container">
        <div className="landing-page__image">
          <figure
            style={{ position: "relative", height: "100%", width: "100%" }}
          >
            <Image
              src="/images/f.jpeg"
              alt="Smart attendance"
              fill
              style={{
                objectFit: "cover",
                position: "absolute",
              }}
              sizes="100%"
              quality={100}
              priority
            />
          </figure>
        </div>
        <div className="landing-page__form">
          <header className="landing-page__header">
            <figure className="">
              <Image
                src="/images/unilorin.jpeg"
                alt="Smart attendance"
                width={100}
                height={100}
              />
            </figure>
            <div className="landing-page__buttons">
              <button
                className={`${
                  pathname.includes("login") ? "active-button" : ""
                }`}
                onClick={() => router.push("/level_adviser/login")}
              >
                LOGIN
              </button>
              <button
                className={`${
                  pathname.includes("signup") ? "active-button" : ""
                }`}
                onClick={() => router.push("/level_adviser/signup")}
              >
                SIGNUP
              </button>
            </div>
          </header>
          <section>
            <LALoginForm />
          </section>
        </div>
      </div>
    </section>
  );
};
export default LoginPage;
