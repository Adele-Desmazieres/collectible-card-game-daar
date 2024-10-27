import { Tabs, Tab, TabList, Input, IconButton, Typography } from '@mui/joy';
import { ChangeEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import TCGLogo from '../assets/pokeball.png'

const TabBar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [tabValue, setTabValue] = useState(location.pathname);

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchQuery(event.target.value);
  }

  function handleSearchSubmit() {
    navigate(`/user/${searchQuery}`)
  }

  return (
    <div className="flex items-center justify-between py-2 px-10 gap-10 bg-white sticky top-0 z-10">
      <div className="flex items-center pt-2">
        <img src={TCGLogo} alt="Pokémon TCG logo" className="w-20" />
        <Typography level="h2">
          Pokémon TCG
        </Typography>
      </div>
      <Tabs
        value={tabValue}
        onChange={(_, v: any) => setTabValue(v)}
        aria-label="navigation tabs"
        size='sm'
      >
        <TabList variant="plain" className="bg-white" disableUnderline size='lg' tabFlex={1}>
          <Tab component={Link} to="/" value='/' className="transition-all" disableIndicator >
            <div className="px-5"> Home </div>
          </Tab>
          <Tab component={Link} to="/admin" value='/admin' className="transition-all" disableIndicator >
            <div className="px-5"> Admin </div>
          </Tab>
          <Tab component={Link} to="/booster" value='/booster' className="transition-all" disableIndicator >
            <div className="px-5"> Booster </div>
          </Tab>
        </TabList>
      </Tabs>

      <form onSubmit={handleSearchSubmit} className="flex items-center ml-auto">
        <Input
          placeholder="Search un user"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ width: '400px', marginRight: '8px' }}
        />
        <IconButton
          onClick={handleSearchSubmit}
          color="neutral"
          variant="soft"
          sx={{ borderRadius: 'md' }}
        >
          <SearchIcon />
        </IconButton>
      </form>
    </div >
  );
};

export default TabBar;
