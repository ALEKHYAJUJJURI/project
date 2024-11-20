
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css'
import {Navbar,Nav,Container} from 'react-bootstrap'
export function LoadingPage(){

    return(
        <div className="container-fluid" style={{'height':'100vh','backgroundSize':'cover'}}>
<div className="row">
<Navbar expand="lg" className="bg-body-tertiary">
      <Container className="d-flex flex-row justify-content-between">
        <Navbar.Brand href="#"><h2  className="me-3">Shopping.</h2></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#"><div className="input-group me-2">
                    <input type="search" placeholder="search here.." className="form-control"/>
                    <button className="btn bi bi-search btn-warning"></button>
                </div></Nav.Link>
            <Nav.Link href="#"><Link to="/signup" className="btn btn-primary">Signup</Link></Nav.Link>
            <Nav.Link href="#"><Link to="/login" className="mx-1 btn btn-warning">Login</Link></Nav.Link>
            <Nav.Link href="#"><span className="bi bi-person-fill btn btn-light rounded-circle"></span></Nav.Link>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
            <div className="">
               <h2 className="h5"> load the components..</h2>
            </div>

</div>
        </div>
    )
}