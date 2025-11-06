
class Rankings {
  constructor() {
    this.apiUrl = "http://wd.etsisi.upm.es:10000/records";
    this.tableBody = document.getElementById("records-body");
    this.noRecordsMsg = document.getElementById("no-records");

    this.loadRankings();
  }

  async loadRankings() {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) throw new Error("Error de conexión con el servidor");

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        this.showRankings(data);
      } else {
        this.showNoRecords();
      }
    } catch (error) {
      this.showNoRecords();
    }
  }

  showRankings(records) {
    this.tableBody.innerHTML = "";

    records.sort((a, b) => b.punctuation - a.punctuation);

    const top10 = records.slice(0, 10);

    top10.forEach((record, index) => {
      const row = document.createElement("tr");

      const date = new Date(record.recordDate);
      const formattedDate = date.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        });
        
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${record.username}</td>
        <td>${record.punctuation}</td>
        <td>${record.ufos}</td>
        <td>${record.disposedTime}</td>
        <td>${formattedDate}</td>
      `;

      this.tableBody.appendChild(row);
    });

    this.noRecordsMsg.style.display = "none";
  }

  showNoRecords() {
    this.tableBody.innerHTML = "";
    this.noRecordsMsg.style.display = "block";
  }
}

window.onload = () => {
  new Rankings();
};
