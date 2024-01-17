const resetPassword = document.getElementById("resetForm");
resetPassword.addEventListener("submit", reset);
const backendApi = 'https://54.161.98.100:3000'


function reset(e) {
    e.preventDefault()
    let remail = document.getElementById("remail").value;

    const details = {
        email: remail
    }

    async function resetPassword() {
        try {
            const res = await axios.post(`${backendApi}/password/resetEmail`, details)
            console.log(res)
            alert(res.data.message)
            document.getElementById("remail").value = "";


        } catch (err) {
            alert(err.response.data.message)
            // document.body.innerHTML =
            //     document.body.innerHTML + `<h4 style="color: red;">${err}</h4>`;
            // console.log(err)
            // console.log();
        }
    }

    resetPassword();
}

