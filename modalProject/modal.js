"use strict";

const btnsShowModal = document.querySelectorAll(".show-modal");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btncloseModal = document.querySelector(".close-modal");

const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
  };
btnsShowModal.forEach((btn) => btn.addEventListener("click", openModal));
// for(let i=0;i<btnsShowModal.length;i++){
//     btnsShowModal[i].addEventListener('click',function(){
//         // console.log('button clicked')
//         modal.classList.remove('hidden');
//         overlay.classList.remove('hidden');
//     })
// }

// btncloseModal.addEventListener('click',function(){
//     // modal.classList.add('hidden');
//     // overlay.classList.add('hidden');
// })

overlay.addEventListener('click',function(){
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
})
//refactoring closeModal and overlay

//dont use () in closeModal()
btncloseModal.addEventListener("click", closeModal);

overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});
