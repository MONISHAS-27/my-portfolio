function createStars() {
   const starContainer = document.getElementById('index')

   for (let i = 0; i < 300; i++) {
      // Decrease the number of stars to 300 since it's only one section
      const star = document.createElement('div')
      star.classList.add('star')
      const size = Math.random() * 3 + 1 // Random size for stars
      const positionX = Math.random() * 100 // Random position X (percentage)
      const positionY = Math.random() * 100 // Random position Y (percentage)
      const animationDelay = Math.random() * 5 // Random animation delay

      star.style.width = size + 'px'
      star.style.height = size + 'px'
      star.style.left = positionX + '%'
      star.style.top = positionY + '%'
      star.style.animationDelay = animationDelay + 's'

      starContainer.appendChild(star)
   }
}

window.onload = createStars // Create stars when the page loads

