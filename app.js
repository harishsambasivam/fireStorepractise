

let form = document.getElementById('add-cafe-form');
let cafeList = document.getElementById('cafe-list');

    
function updateDOM(doc){
    let li = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('span');
    let del = document.createElement('div');
    li.setAttribute('data-id',doc.id);
    name.textContent = doc.data().cafeName;
    city.textContent = doc.data().city;
    del.textContent = 'x';
    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(del);

    cafeList.appendChild(li);
    del.addEventListener('click',(e) =>{
        e.stopPropagation();
        let key = e.target.parentElement.getAttribute('data-id');
        // console.log(key);
        db.collection('cafes').doc(key).delete();
        // alert(`Cafe deleted`);
    });

}

// db.collection("cafes")
// // .where('city','!=','kumbakonam')
// .orderBy('city')
// .get()
// .then(snapshot => {
//     snapshot.docs.forEach(doc => {
//         updateDOM(doc);
//     }); 
// });

// Real time data with firestore

db.collection('cafes')
// .get()
.orderBy('cafeName')
.onSnapshot(snap => {
    let changes = snap.docChanges();
    changes.forEach(change => {
  
        if(change.type == 'added'){
            updateDOM(change.doc);
          
        }else if(change.type == 'removed'){
            let li = document.querySelector(`[data-id=${change.doc.id}]`);
            cafeList.removeChild(li);
        }
    });
});

form.addEventListener('submit',(e) => {
    e.preventDefault();
    db.collection("cafes").add({
            cafeName:form.name.value,
            city:form.city.value
        
        })
        .then(function(docRef) {

            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
        form.city.value = '';
        form.name.value = '';
});



