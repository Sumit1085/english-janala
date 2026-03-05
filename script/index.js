const loadLessions = () =>{
    fetch('https://openapi.programming-hero.com/api/levels/all')
    .then(res => res.json())
    .then(json=>displayLessons(json.data))
}

const manageSpinner =(status)=>{
    if(status){
        document.getElementById('spinner').classList.remove('hidden')
        document.getElementById('word-container').classList.add('hidden')

    }else{
        document.getElementById('spinner').classList.add('hidden')
        document.getElementById('word-container').classList.remove('hidden')
    }
}

const loadLevelWord = (id) =>{
    manageSpinner(true)
    let url = `https://openapi.programming-hero.com/api/level/${id}`
    fetch(url)
    .then(res => res.json())
    .then(data => {
        removeActive()
        const clickBtn = document.getElementById(`lesson-btn-${id}`)
        clickBtn.classList.add('active')
        displayLevelWords(data.data)
    })
}

const displayLevelWords = (words) => {
    const wordContainer = document.getElementById('word-container')
    wordContainer.innerHTML=''
    if(words.length == 0){
        wordContainer.innerHTML = `
            <div class="col-span-full text-center">
                <img class="mx-auto" src="./assets/alert-error.png" alt="">
                <h2 class="text-[13.5px] text-[#79716B]">আপনি এখনো কোন Lesson Select করেন নি</h2>
                <p class="text-[#292524] text-4xl mt-3">একটি Lesson Select করুন।</p>
            </div>
         `
         manageSpinner(false)
    }
    words.forEach(word => {
        const card = document.createElement('div')
        card.innerHTML = `
        <div class="bg-white text-center w-full rounded-xl shadow-sm p-14 space-y-4 h-full">
            <h2 class="text-[32px] font-bold">${word.word ? word.word:"শব্দ খুঁজে পাইনি"}</h2>
            <p class="text-xl">Meaning /Pronounciation</p>
            <p class="text-2xl text-[#18181B] font-semibold">"${word.meaning ? word.meaning : 'অর্থ খুঁজে পাইনি'}/ ${word.pronunciation}"</p>
            <div class="flex justify-between mt-6 cursor-pointer">
                <button  onclick="loadWordDetail(${word.id})"  class="btn bg-[#1A91FF10]"><i class="fa-solid fa-circle-info "></i></button>
                <button class="btn bg-[#1A91FF10]"><i class="fa-solid fa-volume-high"></i></button>
            </div>
        </div>
        `
        wordContainer.appendChild(card)
        manageSpinner(false)
    });

}
const displayLessons =(lessons)=>{
    const levelContainer = document.getElementById('level-container')
    for(let lesson of lessons){
        const btndiv = document.createElement('div');
        btndiv.innerHTML = `
           <button id='lesson-btn-${lesson.level_no}' onclick='loadLevelWord(${lesson.level_no})' class='btn btn-outline btn-primary lesson-btn'><a class='flex items-center gap-1.5'><i class="fa-solid fa-book-open"></i>Lesson - ${lesson.level_no}</a></button>
        `
        levelContainer.appendChild(btndiv)

    }
}
loadLessions()

const removeActive=()=>{
    const lessonButton = document.querySelectorAll('.lesson-btn');
    lessonButton.forEach(btn => btn.classList.remove('active'))

}

const loadWordDetail = async(id) =>{
    const url = `https://openapi.programming-hero.com/api/word/${id}`
    const res = await fetch(url);
    const details = await res.json()
    displayWordDetail(details.data)
}

const displayWordDetail = (word) =>{
    const detailsBox = document.getElementById('details-container');
    detailsBox.innerHTML = `
        <div>
            <h2 class="text-2xl font-bold">${word.word} (<i class="fa-solid fa-microphone-lines"></i>: ${word.pronunciation})</h2>
        </div>
        <div>
            <h2 class="font-bold">Meaning</h2>
            <p >${word.meaning}</p>
        </div>
        <div>
            <h2 class="font-bold">Example</h2>
            <p >${word.sentence}.</p>
        </div>
        <div>
            <h2 class="font-bold">সমার্থক শব্দ গুলো : </h2>
            <div>${createElement(word.synonyms)}</div>
            
        </div>    
    `
    document.getElementById('word_modal').showModal()
}



const createElement = (arr) =>{

  const htmlElement = arr.map(el => `<span class='btn'>${el}</span>`);
  return(htmlElement.join(' '))
}

document.getElementById('btn-search').addEventListener('click', function(){
    removeActive()
    const input = document.getElementById('input-search');
    const searchValue = input.value.trim().toLowerCase()
    fetch('https://openapi.programming-hero.com/api/words/all')
    .then(res => res.json())
    .then(data =>{
        const allWord = data.data;
        // console.log(allWord)
        const filterWord = allWord.filter(word => word.word.toLowerCase().includes(searchValue));
        displayLevelWords(filterWord)
    })
})

