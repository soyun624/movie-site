$(function() {  
    const stringQuery = document.location.search;
    const paramsURL = new URLSearchParams(stringQuery);
    const tv_id = paramsURL.get('id');

    
    const getData = async() =>{
        try{
            const response = await $.ajax({
                url:`https://api.themoviedb.org/3/tv/${tv_id}?api_key=${config.API_KEY}&language=en-US`, 
                type:'GET',
                dataType: 'json'
            })

            return sanitizeData(response);

        }catch(error){
            console.log(error);
        }
    }

    const sanitizeData = (data) =>{
        
        const tv = {
            
            name: data.name,
            poster_path: data.poster_path,
            seasons: data.number_of_seasons, 
            overview: data.overview,
            homepage: data.homepage,
            year: data.first_air_date != null ? ` (${data.first_air_date.substring(0,4)})` : '',
            bgImg: data.backdrop_path,
            original_language: data.original_language,
            status: data.status,
            type: data.type,
            vote_average: data.vote_average,
            vote_count: data.vote_count,
            seasonsAll: data.seasons
             
        }

        return tv;
    }

    const displayData = (data) =>{
        console.log(data)

        const poster_path = data.poster_path != null ? `https://image.tmdb.org/t/p/original${data.poster_path}` : './images/no-image.png'
        const img = $('<img>').attr('src',poster_path);
        $('.tvShowImage').append(img);
        $('.bg').css('background-image',`url(https://image.tmdb.org/t/p/original${data.bgImg})`)
        const year = $('<span></span>').text(data.year);
        const name = $('<h1></h1>').text(data.name).append(year);
        $('.tvShowInfo').append(name);
        const seasons = $('<p class="season"></p>').text('season '+data.seasons);
        $('.tvShowInfo').append(seasons);

        const original_language = $('<p></p>').text(`language : ${data.original_language}`);
        $('.tvShowInfo').append(original_language);

        const overview = $('<p></p>').text(data.overview);
        $('.tvShowInfo').append(overview);

        const movieIcon = $('<i class="fas fa-video"></i>').text(' Watch Now');
        const homepage = $('<button type=button></button>').attr('onclick',`location.href='${data.homepage}'`).append(movieIcon);
        $('.tvShowImage').append(homepage);

        const div = $('<div class=info-bottom></div>');
        $('.tvShowInfo').append(div);

        const tooltip = $('<span class="tooltip"></span>').text('vote average');
        const starIcon = $('<i class="fas fa-star"></i>').text(` ${data.vote_average}`).append(tooltip);
        const vote_average = $('<div class="vote_average"></div>').append(starIcon);
        div.append(vote_average); 
        const type = $('<p></p>').text(`type : ${data.type}`);
        div.append(type);      
        const status = $('<p></p>').text(`status : ${data.status}`);
        div.append(status);
       
        data.seasonsAll.forEach((season) => {
   
            const cardWrapper = $("<div></div>").addClass("text-center");

            const card = $("<div></div>")
            .addClass("card")
            .addClass("position-relative")
            .width("18rem");

            const poster_path = season.poster_path == null ? './images/no-image.png' : `https://image.tmdb.org/t/p/original${season.poster_path}`;
 
            card.append(
                $("<img>")
                  .addClass("card-img-top")
                  .attr(
                    "src",
                    poster_path
                  )
              );

            const cardBody = $("<div></div>").addClass("card-body");
            cardBody.append(
              $("<h5></h5>").addClass("card-title").text(season.name)
            );
            cardBody.append($("<p></p>").addClass("card-text").text(season.overview));

            card.append(cardBody);
            cardWrapper.append(card);
             $("#contents").append(cardWrapper);
        });
    }

    getData().then((value)=>{
       
         displayData(value)
        
    })
})
