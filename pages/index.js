import { set } from "mongoose";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    
    if (!formData.phone.trim() || !formData.password.trim()) {
      return alert("All fields are required");
    }

    try {
      setLoading(true);

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      // console.log(data);

      if (response.ok) {
        setLoading(false);
        setFormData({ phone: "", password: "" });
        router.push("/dashboard");
      } else {
        alert(data.message);
        setLoading(false);
      }
    } catch (error) {}
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <header className="bg-dark m-0 p-0">
        <h1
          className="text-center py-3 display-3 fw-semibold mb-0"
          style={{ color: "skyblue" }}
        >
          Voting System
        </h1>
      </header>
      <div
        className="container-fluid my-0"
        style={{ backgroundColor: "skyblue", minHeight: "76.2vh" }}
      >
        <div className="container">
          <h2 className="display-5 text-center fw-semibold pt-5 pb-3">Login</h2>
          <div className="row d-flex justify-content-center">
            <div className="col-md-6 text-center">
             
              <div className="mb-3">
                <input
                  type="phone"
                  className="form-control form-control-lg"
                  id="exampleFormControlInput1"
                  placeholder="Enter your phone number"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange(e)}
                />
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  className="form-control form-control-lg"
                  id="exampleFormControlInput1"
                  placeholder="Enter your password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => handleChange(e)}
                />
              </div>

              <button
                type="button"
                className="btn btn-dark fs-5 px-md-4 px-2 my-3"
                disabled={loading}
                onClick={() => {
                  handleSubmit();
                }}
              >
                {loading ? "Loading..." : "Login"}
              </button>

              <p className="fs-6 my-3">
                Don't have an account?{" "}
                <Link href="/register" className="text-light">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-dark text-center text-light py-5"></footer>
    </>
  );
}
