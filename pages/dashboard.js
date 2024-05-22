import { useRouter } from "next/navigation";
import { useState } from "react";
import cookie from "cookie";

export default function Dashboard(props) {
  const { user } = props;

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionID: user.sessionID }),
      });

      const data = await response.json();

      if (response.ok) {
        setLoading(false);
        alert(data.message);
        router.push("/");
      } else {
        setLoading(false);
        alert(data.message);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <section style={{ backgroundColor: "skyblue", minHeight: "100vh" }}>
      <div className="container">
        <div
          className="row d-flex justify-content-center align-items-center"
          style={{ minHeight: "100vh" }}
        >
          <div className="col-lg-4 col-md-6">
            <div className="card shadow-sm">
              <img
                src={user?.photo || "https://via.placeholder.com/200"}
                className="card-img-top img-fluid"
                style={{
                  height: "300px",
                  objectFit: "cover",
                  objectPosition: "center",
                  width: "100%",
                }}
                alt={`${user?.name || "User"}'s photo`}
              />
              <div className="card-body">
                <h4 className="card-title text-center">
                  {user?.name || "Name not provided"}
                </h4>
                <h5 className="card-subtitle mb-2 text-muted text-center">
                  {user?.phone || "Phone number not available"}
                </h5>
                <div className="d-flex justify-content-between">
                  <div>
                    <h6>Email:</h6>
                    <p>{user?.email || "Not provided"}</p>
                  </div>
                  <div>
                    <h6>Address:</h6>
                    <p>{user?.address || "Not provided"}</p>
                  </div>
                </div>
                <div className="w-100">
                  <button
                    className="btn btn-dark w-100"
                    onClick={handleLogout}
                    disabled={loading}
                  >
                    {loading ? "Logging out..." : "Logout"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export async function getServerSideProps(context) {
  const { sessionID } = cookie.parse(context.req.headers.cookie || "");

  // Redirect to login page if sessionID is not found
  if (!sessionID) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const httpType = context.req.headers.host.includes("localhost")
    ? "http"
    : "https";

  const response = await fetch(
    `${httpType}://${context.req.headers.host}/api/getUserData?sessionID=${sessionID}`,
    {
      method: "GET",
    }
  );

  const data = await response.json();

  if (!data.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // Ensure that no undefined values are returned
  const user = {
    sessionID: data.user.sessionID || null,
    name: data.user.name || null,
    photo: data.user.photo || null,
    phone: data.user.phone || null,
    email: data.user.email || null,
    address: data.user.address || null,
  };

  return {
    props: {
      user: user,
    },
  };
}
