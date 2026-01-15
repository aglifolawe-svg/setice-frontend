import bcrypt from 'bcrypt'

async function generate() {
  const plainPassword = 'password123' // mot de passe admin
  const hashedPassword = await bcrypt.hash(plainPassword, 10)
  console.log('Mot de passe hashé :', hashedPassword)
}

generate()
