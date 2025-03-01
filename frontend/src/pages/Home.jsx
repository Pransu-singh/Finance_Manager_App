import { Link } from "react-router-dom";
function Home() {
  return (
    <div className="container"> {/* Standard container for desktop-like websites */}
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10 text-center">
          <h1 className="mt-5">Welcome to Personal Finance Manager</h1>
          <p>Track and manage your expenses easily.</p>
          <Link to="/expenses" className="btn btn-primary mt-3">View Expenses</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;

  