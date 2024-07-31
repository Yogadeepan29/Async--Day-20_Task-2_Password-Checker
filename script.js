//!<---------------------------------------- Commonly used functions ---------------------------------------->
//* hide Navbar function

const navbar = document.getElementById("navbar");
let lastScrollY = window.scrollY;
window.addEventListener("scroll", () => {
  if (window.scrollY > lastScrollY && window.scrollY > navbar.offsetHeight) {
    navbar.classList.add("hide");
  } else if (window.scrollY < lastScrollY) {
    navbar.classList.remove("hide");
  }
  lastScrollY = window.scrollY;
});

//* Closing offcanvas after navigating
document.addEventListener("DOMContentLoaded", function () {
  const offcanvasElement = document.getElementById("offcanvasNavbar");
  const offcanvas = new bootstrap.Offcanvas(offcanvasElement);
  const navLinks = offcanvasElement.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      offcanvas.hide();
    });
  });
});

//* format numbers function

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//

//!<---------------------------------------- recent breach section ---------------------------------------->
const recent = document.getElementById("recent");

fetch("https://haveibeenpwned.com/api/v3/latestbreach")
  .then((response) => response.json())
  .then((data) => {
    // console.log(data);
    breachedData = numberWithCommas(data.PwnCount);
    CompromisedData = data.DataClasses.join(", ");
    isoDate = data.ModifiedDate;
    date = new Date(isoDate);

    formattedDate = date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    recent.innerHTML = `
  <div class="row">
  <h1 class="title mb-3" id="updates">Recent Updates</h1><br>
  <h4 class="mb-5">Stay informed about the latest data breaches.</h4>

  <div class="col-sm-2 text-center my-auto ">
    <div class="image-container">
      <img class="img-fluid"  src="${data.LogoPath}" draggable="false" alt="${data.Title}">
      </div>
  </div>

  <div class="col-sm-10">
  <h2 class="text-center text-sm-start">${data.Name}</h2>   
  <strong>( Last Updated On ) :</strong>
  ${formattedDate}
  <hr>
  <p class="a">${data.Description}</p>
  <p>
  <strong>Breach date :</strong>
  ${data.BreachDate}
  <br>
  <strong>Compromised accounts :</strong>
  "${breachedData}"
  <br>
  <strong>Compromised data :</strong>
  ${CompromisedData}
  <br>

  `;
  })

  .catch((error) => {
    recent.innerHTML = `<b class="text-danger fs-3 d-flex justify-content-center ">Unable to show Recent Updates "Error: ${
      error.message || error
    }" </b>`;
  });

//! <----------------------------------------- Password checker ----------------------------------------->

const password = document.getElementById("password");
const search = document.getElementById("dark-search");
const result = document.getElementById("result");
const gif = document.getElementById("gif");
const errorText = document.getElementById("error");

search.addEventListener("click", dark);

password.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    dark();
  }
});

password.addEventListener("click", () => {
  if (gif.getAttribute("src") !== "src/home.svg") {
    gif.classList.add("fade-out");
    setTimeout(() => {
      gif.src = "src/home.svg";
      gif.classList.add("fade-in");
      gif.classList.remove("re-size", "fade-out");
      result.innerHTML = "";
      password.value = "";
      setTimeout(() => {
        gif.classList.remove("fade-in");
      }, 400);
    }, 400);
  } else {
    result.innerHTML = "";
  }
});

function dark() {
  const userInput = password.value.trim();

  if (!userInput) {
    errorText.innerHTML = `<b>Please enter a password</b>`;
    return;
  }
  const hashedPassword = sha1(userInput);
  const prefix = hashedPassword.slice(0, 5);

  // console.log(`This is a Hashed Value : ${hashedPassword}`);
  // console.log(`This is a prefix value : ${prefix}`);

  fetch(`https://api.pwnedpasswords.com/range/${prefix}`)
    .then((response) => response.text())
    .then((data) => {
      // console.log(data);
      errorText.innerHTML = "";
      const lines = data.split("\r\n");
      let passwordFound = false;
      lines.some((line) => {
        const [hash, count] = line.split(":");
        const fullHash = (prefix + hash).toLowerCase();
        const counts = numberWithCommas(count);
        if (fullHash === hashedPassword.toLowerCase()) {
          passwordFound = true;
          gif.src = "src/data breach.gif";
          gif.classList.add("re-size");
          result.innerHTML = `<div class="alert alert-warning d-flex align-items-center justify-content-center text-danger" role="alert">
                                <i class="fa-solid fa-triangle-exclamation p-2 "></i>
                                  <div>
                                     &nbsp Your Password has been Found ${counts} Times in Dark web.
                                  </div>
                              </div>
     
          `;
          // console.log(`Password has been pwned ${count} times!`);
          return true;
        }
        return false;
      });
      if (!passwordFound) {
        gif.classList.add("re-size");
        gif.src = "src/safe.gif";
        result.innerHTML = `
                              <div class="alert alert-success d-flex align-items-center justify-content-center text-success" role="alert">
                                <i class="fa-solid fa-shield p-2"></i>
                                  <div>
                                      &nbsp Your Password is Safe
                                  </div>
                              </div>
        `;
        console.log(`Password is safe!`);
      }
    })
    .catch((error) => {
      errorText.textContent = `Error: ${error.message || error}`;
    });
}
