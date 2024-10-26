import { Button, Card, Container, Typography } from "@mui/joy";
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <Container className="mt-20">
      <Card>
        <Typography level="h1">Welcome to Pokémon TCG</Typography>
        <div className="flex gap-5">
          <Button> <Link to="/admin">Go to the admin page</Link> </Button>
          <Button> <Link to="/">Go to the Marketplace</Link> </Button>
          <Button> <Link to="/profile">Your profile </Link> </Button>
          <Button> <Link to="/booster">Open a booster</Link> </Button>
          <Button> <Link to="/profile/">Someone else's profile</Link> </Button>
        </div>
      </Card>
    </Container>
  )
}
