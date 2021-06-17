(async () => {
  const getFavArray = () => {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  };

  const displayViews = (data) => {
    if (!data) {
      $("#tv-shows").append(
        $("<div>")
          .addClass("alert")
          .addClass("alert-danger")
          .attr("role", "alert")
          .text("no favorite added")
          .css({
            position: "absolute",
            bottom: 0,
          })
      );
      return;
    }
    data.results
      .filter((ts) => {
        return getFavArray().includes(ts.id.toString());
      })
      .forEach((tvShow) => {
        const link = $("<a>")
          .addClass("text-black-50")
          .addClass("text-decoration-none")
          .attr("href", `/individual.html?id=${tvShow.id}`);

        const cardWrapper = $("<div></div>")
          .addClass("col")
          .addClass("col-sm-3")
          .addClass("pt-2")
          .addClass("text-center");
        const card = $("<div></div>")
          .addClass("card")
          .addClass("position-relative")
          .addClass("mx-auto")
          .width("18rem");

        const favBtn = $("<i>")
          .attr("id", tvShow.id)
          .addClass("fa")
          .addClass("fa-heart")
          .css({
            color: getFavArray().includes(tvShow.id.toString())
              ? "red"
              : "grey",
            position: "absolute",
            top: 8,
            right: 8,
          });
        card.append(favBtn);
        favBtn.click((e) => {
          if (getFavArray().includes(e.target.id)) {
            console.log("true");
            $(e.currentTarget).css("color", "grey");
            localStorage.setItem(
              "favorites",
              JSON.stringify(
                getFavArray().filter((v) => v !== e.currentTarget.id)
              )
            );
          } else {
            $(e.currentTarget).css("color", "red");
            localStorage.setItem(
              "favorites",
              JSON.stringify([...getFavArray(), e.target.id])
            );
          }
        });
        card.append(
          $("<img>")
            .addClass("card-img-top")
            .attr(
              "src",
              `https://image.tmdb.org/t/p/original${tvShow.backdrop_path}`
            )
        );
        const cardBody = $("<div></div>").addClass("card-body");
        cardBody.append(
          $("<h5></h5>").addClass("card-title").text(tvShow.original_name)
        );

      const progress = $("<div></div>").addClass("progress");
      const progressBar = $("<div></div>").addClass("progress-bar").attr("role", "progressbar").css("width", `${tvShow.vote_average*10}%`)
      const textAberage =  $("<p></p>").addClass("card-text").text(`vote average: ${tvShow.vote_average}`)
      progress.append(progressBar)
      cardBody.append(progress)
      progressBar.append(textAberage)

        link.append(cardBody);
        card.append(link);
        cardWrapper.append(card);
        $("#tv-shows").append(cardWrapper);
      });
  };

  try {
    const data = await $.ajax({
      url: `https://api.themoviedb.org/3/tv/popular?api_key=${config.API_KEY}&language=en-US&page=1`,
    });
    displayViews(data);
  } catch (error) {
    displayViews(null);
  }
})();
