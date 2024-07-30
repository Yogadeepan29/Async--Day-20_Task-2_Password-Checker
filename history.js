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

//! <----------------------------------------- History breachs ----------------------------------------->

const history = document.getElementById("history");
const pagination = document.getElementById("pagination");
const navigate = document.getElementById("navigate");

fetch("https://haveibeenpwned.com/api/v3/breaches")
  .then((response) => response.json())
  .then((data) => {
    // console.log(data);

    const itemsPerPage = 100;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    let currentPage = 1;

    //* handling data using function
    function renderData() {
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const pageData = data.slice(start, end);

      let html = "";
      pageData.forEach((item) => {
        isoDate = item.ModifiedDate;
        date = new Date(isoDate);
        formattedDate = date.toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        breachedData = numberWithCommas(item.PwnCount);
        CompromisedData = item.DataClasses.join(", ");

        html += `
          <div class="row">
            <div class="col-sm-2 my-auto text-center">
              <img class="logo img-fluid" height="75px" width="100px" src="${
                item.LogoPath
              }" draggable="false" alt="${item.Title}">
            </div>
            <div class="col-sm-10">
              <h2 class="text-center text-md-start mb-3">${item.Name}</h2>   
              <strong> ( Last Updated On ) :</strong>
              ${formattedDate}
              <br>
              <br>
          
              <p>${item.Description}</p>
              <p>
                <strong>Breach date :</strong>
                ${item.BreachDate}
                <br>
                <strong>Domain Name :</strong>
                ${item.Domain ? item.Domain : '"Unknown"'}
                <br>
                <strong>Compromised accounts :</strong>
                "${breachedData}"
                <br>
                <strong>Compromised data :</strong>
                ${CompromisedData}
                <br>
              </p>
            </div>
          </div>
          <hr class="mb-5">
        `;
      });

      history.innerHTML = html;
    }

    //* Pagination Logics

    function renderPagination() {
      let html = `
    <ul class="pagination justify-content-center justify-content-sm-between">
      <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
        <a class="page-link" href="#" onclick="changePage(event, ${
          currentPage - 1
        })"><span aria-hidden="true">&laquo</span></a>
      </li>
    `;

      for (let i = 1; i <= totalPages; i++) {
        html += `
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <a class="page-link" href="#" onclick="changePage(event, ${i})">${i}</a>
      </li>
    `;
      }

      html += `
      <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
        <a class="page-link" href="#" onclick="changePage(event, ${
          currentPage + 1
        })"><span aria-hidden="true">&raquo</span></a>
      </li>
    </ul>
  `;

      pagination.innerHTML = html;
    }

    //* Bottom navigation buttons

    function renderNavigate() {
      let html = `
<ul class="pagination justify-content-center justify-content-sm-between">
  <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
    <a class="page-link" href="#" onclick="changePage(event, ${
      currentPage - 1
    })">Previous</a>
  </li>
  <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
    <a class="page-link" href="#" onclick="changePage(event, ${
      currentPage + 1
    })">Next</a>
  </li>
</ul>
`;
      navigate.innerHTML = html;
    }

    function changePage(event, page) {
      event.preventDefault();
      currentPage = page;
      renderData();
      renderPagination();
      renderNavigate();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    renderData();
    renderPagination();
    renderNavigate();

    window.changePage = changePage;
  })
  .catch((error) => {
    history.innerHTML = `<b class="text-danger fs-3 d-flex justify-content-center ">Unable to show Recent Updates "Error: ${
      error.message || error
    }" </b>`;
  });
