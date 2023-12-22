const expense = document.getElementById("expense");
expense.addEventListener("submit", addExpense);

const eList = document.getElementById("expenseList");
eList.addEventListener("click", updateExpense);

function addExpense(e) {
  e.preventDefault();

  let amount = document.getElementById("amount").value;
  let description = document.getElementById("desc").value;
  let category = document.getElementById("category").value;

  const details = {
    amount: amount,
    description: description,
    category: category,
  };

  async function userSignup() {
    try {
      const res = await axios.post(
        "http://localhost:3000/expense/addExpense",
        details
      );

      showExpense(res.data.expenseDetails);

      //document.getElementById("amount").value = "";
      //document.getElementById("description").value = "";
    } catch (err) {
      document.body.innerHTML =
        document.body.innerHTML + `<h4 style="color: red;">${err.message}</h4>`;
      console.log(err);
    }
  }

  userSignup();
}

function showExpense(obj) {
  //Creating Span Element for id
  const sId = document.createElement("span");
  sId.className = "id";
  sId.style.display = "none";
  sId.appendChild(document.createTextNode(obj.id));

  //Creating Delete Button and adding class and Text Node to it
  const deletebtn = document.createElement("button");
  deletebtn.className = "btn btn-sm float-right delete";
  deletebtn.appendChild(document.createTextNode("Delete Expense"));

  // Creating li Element
  const li = document.createElement("li");
  li.className = "list-group-item";
  li.append(
    obj.Amount,
    " ",
    obj.Description,
    " ",
    obj.Category,
    sId,
    deletebtn
  );

  //Appending li to ul tag
  eList.appendChild(li);

  if (eList.children.length > 0) {
    document.getElementById("expenseDetails").style.visibility = "visible";
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await axios.get("http://localhost:3000/expense/getExpense");
    //console.log(res)
    for (let i = 0; i < res.data.allExpenseDetails.length; i++) {
      //console.log(res.data.allExpenseDetails[i])
      showExpense(res.data.allExpenseDetails[i]);
    }
  } catch (err) {
    document.body.innerHTML =
      document.body.innerHTML + "<h4>Could not show Details</h4>";

    console.log(err);
  }
});

function updateExpense(e) {
  //Code for Delete Button
  if (e.target.classList.contains("delete")) {
    let li = e.target.parentElement;
    eList.removeChild(li);

    const key =
      e.target.parentElement.getElementsByClassName("id")[0].textContent;

    if (eList.children.length === 0) {
      document.getElementById("expenseDetails").style.visibility = "hidden";
    }
    //console.log(eList.children.length);

    axios
      .delete(`http://localhost:3000/expense/deleteExpense/${key}`)
      .catch((err) => {
        console.log(err);
      });
  }
}
