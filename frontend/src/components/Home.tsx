import { Button, Card, Container, Typography } from "@mui/joy";
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <Container className="mt-20">
      <Card>
        <Typography level="h1">Welcome to Pokémon TCG</Typography>
        <div className="flex gap-5">
          <Link to="/admin"> <Button> Go to the admin page </Button> </Link>
          <Link to="/"> <Button> Go to the Marketplace </Button> </Link>
          <Link to="/profile"> <Button> Your profile </Button> </Link>
          <Link to="/booster"> <Button> Open a booster </Button> </Link>
          <Link to="/profile/"> <Button> Someone else's profile </Button> </Link>
        </div>
      </Card>
    </Container >
  )
}
