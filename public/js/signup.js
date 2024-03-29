const signup = document.getElementById("signup");
signup.addEventListener("submit", submitUser);
const backendApi = 'https://54.161.98.100:3000'

function submitUser(e) {
  e.preventDefault();

  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  const details = {
    Name: name,
    Email: email,
    Password: password,
  };

  async function userSignup() {
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
    } catch (err) {
      document.body.innerHTML =
        document.body.innerHTML + `<h4 style="color: red;">${err}</h4>`;
      console.log(err);
    }
  }

  userSignup();
}
