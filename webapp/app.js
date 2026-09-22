function createStars() {
   const starContainer = document.body

   for (let i = 0; i < 2000; i++) {
      // Increase the number of stars to 1000
      const star = document.createElement('div')
      star.classList.add('star')
      const size = Math.random() * 3 + 1 // Random size for stars
      const positionX = Math.random() * 100 // Random position X (percentage)
      const positionY = Math.random() * 600 // Random position Y (percentage)
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

