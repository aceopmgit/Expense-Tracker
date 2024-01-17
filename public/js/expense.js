const token = localStorage.getItem("token");
let rows = localStorage.getItem('rows')
if (rows === null) {
  rows = 10;
}

const expense = document.getElementById("expense");
expense.addEventListener("submit", addExpense);

const eList = document.getElementById("expenseList");
eList.addEventListener("click", updateExpense);

const premium = document.getElementById('premium');
premium.addEventListener('click', premiumUser);

const backendApi = 'http://54.161.98.100:3000'
const rpagination = document.getElementById('rpagination');


async function addExpense(e) {
  try {
    e.preventDefault();

    let amount = document.getElementById("amount").value;
    let description = document.getElementById("desc").value;
    let category = document.getElementById("category").value;



    const details = {
      amount: amount,
      description: description,
      category: category,

    };


    const res = await axios.post(`${backendApi}/expense/addExpense`, details, { headers: { "Authorization": token } });
    //axios only accepts the rsponse in the range of 200.if response is greater than 200 it will go to catch

    showExpense(res.data.expenseDetails);

    //Updating Amount of user in front-end
    const result = await axios.get(`${backendApi}/user/getTotal`, { headers: { "Authorization": token } })
    document.getElementById('total').innerHTML = `${result.data.total}`;
    document.getElementById('rtotal').innerHTML = `${result.data.total}`;

    // document.getElementById("amount").value = "";
    // document.getElementById("desc").value = "";
    // document.getElementById("category").value = "";


  } catch (err) {
    document.body.innerHTML =
      document.body.innerHTML + `<h4 style="color: red;">${err.message}</h4>`;
    console.log(err);
  }



}

async function showExpense(obj) {

  //Creating Span Element for id
  const sId = document.createElement("span");
  sId.className = "id";
  sId.style.display = "none";
  sId.appendChild(document.createTextNode(obj.id));

  //Creating span element to track amount
  const sAmount = document.createElement('span');
  sAmount.className = 'amount';
  sAmount.style.display = 'none';
  sAmount.appendChild(document.createTextNode(obj.Amount));

  //Creating Delete Button and adding class and Text Node to it
  const deletebtn = document.createElement("button");
  deletebtn.className = "btn btn-danger float-right delete";
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
    sAmount,
    deletebtn
  );

  //Appending li to ul tag
  eList.appendChild(li);

  if (eList.children.length > 0) {
    document.getElementById("expenseDetails").style.visibility = "visible";
  }
}

function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

window.addEventListener("DOMContentLoaded", async () => {
  try {

    const res = await axios.get(`${backendApi}/expense/getExpense`, { headers: { "Authorization": token } });


    for (let i = 0; i < res.data.expenses.length; i++) {
      //console.log(res.data.allExpenseDetails[i])
      showExpense(res.data.expenses[i]);
    }
    //console.log(res);


    //Updating Amount of user in front-end
    const result = await axios.get(`${backendApi}/user/getTotal`, { headers: { "Authorization": token } })
    document.getElementById('total').innerHTML = `${result.data.total}`;
    document.getElementById('rtotal').innerHTML = `${result.data.total}`;

    const decodedToken = parseJwt(token);
    const premiumCheck = decodedToken.premium;
    if (premiumCheck) {
      premium.remove();
      document.getElementById('premium-icon').style.visibility = 'visible';
      document.getElementById('leaderBoard').style.visibility = 'visible';
      document.getElementById('report').style.visibility = 'visible';
      showLeaderBoard();


      showReport(1, rows);
      document.getElementById('rows').value = rows
    }
    else {
      premium.style.visibility = 'visible';
    }

    // 
    // const result = await axios.get(`${backendApi}/expense/reports?page=${page}`, { headers: { "Authorization": token } })
    // showReport(result.data.expenses);
    // showPagination(result.data);



  } catch (err) {
    document.body.innerHTML = document.body.innerHTML + '<h4 style="color: red;">Could not show Details</h4>';

    console.log(err);
  }
});

async function premiumUser(e) {

  const res = await axios.get(`${backendApi}/purchase/premiumMembership`, { headers: { "Authorization": token } });
  console.log(res);

  const options = {
    "key": res.data.key_id,
    "order_id": res.data.order.id,
    "handler": async function (response) {

      const ut = await axios.post(`${backendApi}/purchase/updateTransaction`, {
        order_id: options.order_id,
        payment_id: response.razorpay_payment_id,
        status: 'SUCCESSFUL'
      }, { headers: { "Authorization": token } })

      premium.remove();
      document.getElementById('premium-icon').style.visibility = 'visible';
      document.getElementById('leaderBoard').style.visibility = 'visible';
      document.getElementById('report').style.visibility = 'visible';
      localStorage.setItem('token', ut.data.token)
      showLeaderBoard();
      alert('You are a premium user now !');


    }

  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on('payment.failed', async function (response) {
    console.log(response)
    alert('Something went wrong !');
    await axios.post(`${backendApi}/purchase/updateTransaction`, {
      order_id: options.order_id,
      payment_id: response.razorpay_payment_id,
      status: 'FAILED'
    }, { headers: { "Authorization": token } })
  })

}

async function showLeaderBoard() {
  try {
    const leaderList = document.getElementById('leaderList');
    leaderList.innerHTML = "";

    const leaders = await axios.get(`${backendApi}/purchase/showLeaderBoard`, { headers: { "Authorization": token } });

    // console.log(leaders.data.details);
    for (let i = 0; i < leaders.data.details.length; i++) {
      //console.log(leaders.data.details[i]);
      const li = document.createElement("li");
      li.className = "list-group-item";
      li.style.backgroundColor = '#eef76c'
      li.append(leaders.data.details[i].Name, " ", leaders.data.details[i].Total);
      leaderList.appendChild(li);
    }
  } catch (err) {
    console.log(err);
  }
}


function showPagination({
  currentPage,
  hasNextPage,
  nextPage,
  hasPreviousPage,
  previousPage,

}) {
  rpagination.innerHTML = "";
  //console.log(rpagination)

  if (hasPreviousPage) {
    const pbtn = document.createElement('button');
    pbtn.className = 'page-item';
    pbtn.innerHTML = previousPage
    pbtn.addEventListener('click', () => { showReport(previousPage, rows) });
    rpagination.appendChild(pbtn);
  }
  const cbtn = document.createElement('button');
  cbtn.className = 'page-item';
  cbtn.innerHTML = currentPage;
  cbtn.addEventListener('click', () => { showReport(currentPage, rows) });
  rpagination.appendChild(cbtn);

  if (hasNextPage) {
    const nbtn = document.createElement('button');
    nbtn.className = 'page-item';
    nbtn.innerHTML = nextPage;
    nbtn.addEventListener('click', () => { showReport(nextPage, rows) });
    rpagination.appendChild(nbtn);

  }
}

function limitRows() {
  const rows = document.getElementById('rows').value;
  localStorage.setItem('rows', rows);


  showReport(1, rows);
}

async function showReport(page, limit) {
  try {
    const expenseBody = document.getElementById('expenseBody');
    expenseBody.innerHTML = "";

    //For showing user Expenses
    const res = await axios.get(`${backendApi}/expense/getExpense?page=${page}&limit=${limit}`, { headers: { "Authorization": token } });


    for (let i = 0; i < res.data.expenses.length; i++) {
      const tr = document.createElement('tr');

      const date = document.createElement('td');
      date.appendChild(document.createTextNode(res.data.expenses[i].createdAt));

      const category = document.createElement('td');
      category.appendChild(document.createTextNode(res.data.expenses[i].Category));

      const description = document.createElement('td');
      description.appendChild(document.createTextNode(res.data.expenses[i].Description));

      const amount = document.createElement('td');
      amount.appendChild(document.createTextNode(res.data.expenses[i].Amount));

      tr.append(date, category, description, amount);
      expenseBody.appendChild(tr);

      //console.log(res.data.allExpenseDetails[i]);
    }
    showPagination(res.data)
    downloadHistory();

  } catch (err) {
    console.log(err);
  }
}

async function downloadHistory() {
  try {

    const dList = document.getElementById('dhistory');
    dList.innerHTML = "";

    //For showing download history of user
    const result = await axios.get(`${backendApi}/expense/downloadHistory`, { headers: { "Authorization": token } });
    //console.log(result)
    for (let i = 0; i < result.data.downloadList.length; i++) {
      const tr = document.createElement('tr');

      const date = document.createElement('td');
      date.appendChild(document.createTextNode(result.data.downloadList[i].createdAt));

      const link = document.createElement('a');
      link.appendChild(document.createTextNode(result.data.downloadList[i].Name));
      link.href = `${result.data.downloadList[i].Url}`;

      const file = document.createElement('td');
      file.appendChild(link);

      tr.append(date, file);
      dList.appendChild(tr);
      //console.log(result.data.downloadList.length);
    }
  }
  catch (err) {
    console.log(err);
  }
}

async function download() {
  try {
    let response = await axios.get(`${backendApi}/expense/download`, { headers: { "Authorization": token } })

    if (response.status === 200) {
      //the bcakend is essentially sending a download link
      //  which if we open in browser, the file would download
      let a = document.createElement("a");
      a.href = response.data.fileUrl;
      a.download = 'myexpense.csv';
      a.click();
      downloadHistory();
    } else {
      throw new Error(response.data.message)
    }


  } catch (err) {
    console.log(err);
  }


}

async function updateExpense(e) {
  try {
    //Code for Delete Button
    if (e.target.classList.contains("delete")) {

      const key = e.target.parentElement.getElementsByClassName("id")[0].textContent;
      const amount = e.target.parentElement.getElementsByClassName('amount')[0].textContent;

      let li = e.target.parentElement;
      eList.removeChild(li);



      if (eList.children.length === 0) {
        document.getElementById("expenseDetails").style.visibility = "hidden";
      }
      //console.log(eList.children.length);

      axios.delete(`${backendApi}/expense/deleteExpense/${key}`, { headers: { "Authorization": token } })
        .catch((err) => { console.log(err); });


      const total = Number(document.getElementById('total').textContent) - Number(amount);
      document.getElementById('total').innerHTML = total



    }
  } catch (err) {
    document.body.innerHTML = document.body.innerHTML + '<h4 style="color: red;">Could not delete expense !</h4>';

    console.log(err);
  }
}


