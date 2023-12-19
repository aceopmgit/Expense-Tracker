const button=document.getElementById('button');
button.addEventListener('click',submitUser);

function submitUser(e){
    e.preventDefault();
    //console.log('hello')
    const name=document.getElementById('name').value;
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;

    const details={
        Name:name,
        Email:email,
        Password:password
    }

    
        
    axios.post('http://localhost:3000/user/addUser',details)
        .then((res)=>{
            //console.log(res);            
            document.getElementById('name').value="";
            document.getElementById('phone').value="";
            document.getElementById('password').value="";
            

            //showDetails(res.data);
        }).catch((err)=>{
            document.body.innerHTML=document.body.innerHTML +'<h4>Something went wrong</h4>'
            console.log(err);
        
        })
               



}


