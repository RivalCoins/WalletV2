import React from 'react';
import { Form, Field } from 'react-final-form';

import Input from 'components/common/Input';
import Error from 'components/common/Error';
import Button from 'components/common/Button';
import ButtonContainer from 'components/common/ButtonContainer';
import Layout from 'components/common/Layouts/BaseLayout';

export type FormValues = {
  name: string;
};

type CreateWalletType = {
  children?: React.ReactNode;
  onSubmit: (v: FormValues) => Promise<Partial<FormValues>>;
};

const CreateWallet = ({ children, onSubmit }: CreateWalletType) => {
  const validateForm = (values: FormValues) => {
    const errors: Partial<FormValues> = {};

    if (!values.name) {
      errors.name = '';
    }

    return errors;
  };

  return (
    <>
      {children && (
        <div
          style={{
            marginBottom: '11px',
          }}
        >
          {children}
        </div>
      )}
      <Layout>
        <Form
          onSubmit={onSubmit}
          validate={(values: FormValues) => validateForm(values)}
          render={({ submitError, handleSubmit, pristine }) => (
            <form
              className="form"
              onSubmit={handleSubmit}
              autoComplete="off"
            >
              <Field name="name">
                {({ input, meta }) => (
                  <div style={{ marginTop: '16px' }}>
                    <label className="label-primary">
                      Wallet name
                    </label>
                    <Input
                      type="text"
                      size="medium"
                      placeholder="John"
                      input={input}
                      meta={meta}
                      autoFocus
                    />
                  </div>
                )}
              </Field>

              {submitError && <Error>{submitError}</Error>}
              <ButtonContainer fixedBottom mb={39}>
                <Button
                  type="submit"
                  variant="primary"
                  size="medium"
                  content="Create"
                  disabled={pristine}
                />
              </ButtonContainer>
            </form>
          )}
        />
      </Layout>
    </>
  );
};

CreateWallet.defaultProps = {
  children: '',
};

export default CreateWallet;
