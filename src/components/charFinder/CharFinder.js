import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import './charFinder.scss';

function CharFinder() {
    const [name, setName] = useState('');
    const {getCharacterByName} = useMarvelService();
    const [toggleName, setToggleName] = useState(false);
    const [toggleError, setToggleError] = useState(false);
  
  

  const getCharName = (e) => {
    e.preventDefault();
    getCharacterByName(name)
      .then(viewChar)
      .catch(getError)
  }

  const handleChange = (event) => {
    setName(event.target.value);
  }

  const viewChar = (data) => {
      setName(data);
      setToggleName(!toggleName);
      setToggleError(false);
}

    const getError = () => {
        console.log('error in request sorry buddy');
        setToggleError(true);
    } 


  return (
    <Formik
        initialValues={{
            name: ''
        }}
        validationSchema = {Yup.object({
            name: Yup.string()
                    .required('This field is required')
        })}
    >
        <Form className="charfinder">
            <p>Or find a character by name:</p>
            <div className="charfinder__content">
                <Field 
                    id="name"
                    name="name"
                    as="input"
                    placeholder="Enter name"
                    onChange={handleChange}
                    value={name} />
                <button onClick={getCharName} className="button button__main">
                    <div className="inner">Find</div>
                </button>
            </div>
            <div>
                <ErrorMessage name="name" className="error" component="div" />
            </div>
            {toggleError ? <div className="charfinder__error">The character was not found. Check the name and try again</div> : null}
            <div className={toggleName ? 'charfinder__toggle show' : 'charfinder__toggle hide'}>
            <a>There is! Visit {name.name} page?</a>
            <button className="button button__secondary">
                <div className="inner"><Link to={`/character/${name.id}`}>To page</Link></div>
            </button>
            </div>
            
        </Form>
    </Formik>
    
  )
}

export default CharFinder