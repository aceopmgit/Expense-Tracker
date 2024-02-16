const signup = document.getElementById("signup");
signup.addEventListener("submit", submitUser);

async function submitUser(e) {
  e.preventDefault();

  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  const details = {
    Name: name,
    Email: email,
    Password: password,
  };
  try {
    const res = await axios.post(
      `/user/addUser`,
      details
    );

    alert(res.data.message);
    window.location.href = "/user/login";

    //document.getElementById("name").value = "";
    //document.getElementById("email").value = "";
    //document.getElementById("password").value = "";
  }
  catch (err) {

    if (err.response.status < 500) {
      alert(err.response.data.message);
    }
    else {

      document.body.innerHTML =
        document.body.innerHTML + `<h4 style="color: red;">${err}</h4>`;
      console.log(err);
    }

  }
}


