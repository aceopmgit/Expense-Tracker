const login = document.getElementById("login");
login.addEventListener("submit", submitUser);

const resetPassword = document.getElementById("resetForm");
resetPassword.addEventListener("submit", reset);

function submitUser(e) {
  e.preventDefault();

  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  const details = {
    Email: email,
    Password: password,
  };

  async function loginCheck() {
    try {
      const res = await axios.post(
        "http://localhost:3000/user/loginCheck",
        details
      );
      alert(res.data.message);
      localStorage.setItem("token", res.data.token);
      window.location.href = "/expense/enterExpense";

      //document.getElementById("email").value = "";
      //document.getElementById("password").value = "";
    } catch (err) {
      document.body.innerHTML =
        document.body.innerHTML + `<h4 style="color: red;">${err.message}</h4>`;
      console.log(err);
    }
  }

  loginCheck();
}

async function reset() {
  try {
    let remail = document.getElementById("remail").value;

    const details = {
      email: remail
    }
    console.log(details)

    const res = await axios.post("http://localhost:3000/password/forgotpassword", details);
    alert('email');

  } catch (err) {
    document.body.innerHTML =
      document.body.innerHTML + `<h4 style="color: red;">${err.message}</h4>`;
    console.log(err);
  }
}


