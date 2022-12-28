import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import useMarvelService from '../../services/MarvelService';
import './charFinder.scss';

function CharFinder() {
    const [name, setName] = useState('');
    const {getCharacterByName} = useMarvelService();
    const [toggleName, setToggleName] = useState(false);
  
  

  const getCharName = (e) => {
    e.preventDefault();
    const name = 'thor';
    getCharacterByName(name)
      .then(viewChar)
  }

  const viewChar = (data) => {
      setName(data);
      setToggleName(!toggleName);
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
                    placeholder="Enter name" />
                <button onClick={getCharName} className="button button__main">
                    <div className="inner">Find</div>
                </button>
            </div>
            <div>
                <ErrorMessage name="name" className="error" component="div" />
            </div>
            <div className={toggleName ? 'charfinder__toggle show' : 'charfinder__toggle hide'}>
            <a>There is! Visit {name.name} page?</a>
            <button className="button button__secondary">
                <div className="inner">To page</div>
            </button>
            </div>
            
        </Form>
    </Formik>
    
  )
}

export default CharFinder