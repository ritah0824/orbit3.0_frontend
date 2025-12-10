let date = new Date("2025-10-05");

function getNASAImage() {
    date.setDate(date.getDate() - 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    let dateStr = year + "-" + month + "-" + day;
    fetch('https://api.nasa.gov/planetary/apod?api_key=nadHSFcvaHdLHtlXiPwRjMeOS9vKdgvTYZFgh9c1&date=' + dateStr)
        .then(response => {
            if (!response.ok) throw new Error('Request failed');
            return response.json();
        })
        .then(data => {
            document.querySelector(".page-bg").style.backgroundImage = "url('" + data.hdurl + "')";
            document.querySelector("#page-bg").classList.add('page-bg-active');
            setTimeout(() => {
                document.querySelector("#page-bg").classList.remove('page-bg-active');
            }, 250);
        })
        .catch(error => console.error(error));
}

getNASAImage();