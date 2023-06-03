$('#recipeCarousel').carousel({
  interval: 3000,
  wrap: true,
  keyboard: true
})

$('.carousel .carousel-item').each(function () {
  const minPerSlide = 1;
  let next = $(this).next();
  if (!next.length) {
    next = $(this).siblings(':first');
  }
  next.children(':first-child').clone().appendTo($(this));

  for (let i = 0; i < minPerSlide; i++) {
    next = next.next();
    if (!next.length) {
      next = $(this).siblings(':first');
    }

    next.children(':first-child').clone().appendTo($(this));
  }
});
