import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "baigan");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/adincloud/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const image = await res.json();
    return image.secure_url;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { name, phone, password, confirmPassword } = formData;

    if (!name || !phone || !password || !confirmPassword) {
      alert("All fields are required");
      return false;
    }

    if (phone.length !== 10) {
      alert("Phone number must be 10 digits");
      return false;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return false;
    }

    if (!file) {
      alert("Please upload a photo");
      return false;
    }

    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      alert("Please upload a valid image file");
      return false;
    }

    if (file.size > 1024 * 1024 * 1) {
      alert("Image size must be less than 1MB");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const imageUrl = await uploadToCloudinary(file);

      if (!imageUrl) {
        alert("Image upload failed");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, photo: imageUrl }),
      });

      const data = await response.json();
      alert(data.success ? "Registration successful" : data.message);
    } catch (error) {
      console.error("Error during registration:", error.message);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Register</title>
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
          <h2 className="display-5 text-center fw-semibold pt-5 pb-3">
            Register
          </h2>
          <div className="row d-flex justify-content-center">
            <div className="col-md-6 text-center">
              {[
                { type: "text", name: "name", placeholder: "Enter your name" },
                {
                  type: "number",
                  name: "phone",
                  placeholder: "Enter your mobile number",
                },
                {
                  type: "password",
                  name: "password",
                  placeholder: "Enter your password",
                },
                {
                  type: "password",
                  name: "confirmPassword",
                  placeholder: "Confirm your password",
                },
              ].map((input, index) => (
                <div className="mb-3" key={index + '1'}>
                  <input
                    type={input.type}
                    className="form-control form-control-lg"
                    placeholder={input.placeholder}
                    name={input.name}
                    value={formData[input.name]}
                    onChange={handleChange}
                  />
                </div>
              ))}
              <div className="mb-3">
                <input
                  type="file"
                  className="form-control form-control-lg"
                  accept="image/jpeg, image/png, image/jpg"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
             
              <button
                type="button"
                className="btn btn-dark fs-5 px-md-4 px-2 my-3"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>
              <p className="fs-6 my-3">
                Already have an account?{" "}
                <Link href="/" className="text-light">
                  Login
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
