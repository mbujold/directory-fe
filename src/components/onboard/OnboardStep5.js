import React, { Component } from 'react';
import PropTypes from 'prop-types';

import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';

import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';

import { Button, Row, Col } from 'reactstrap';

import TeamPicker from '../core/TeamPicker';
import SupervisorPicker from '../core/SupervisorPicker';

const orgTeamQuery = gql`
query orgTeamQuery($gcID: String!) {
  profiles(gcID: $gcID) {
    gcID
    supervisor {
      gcID
      name
    }
    org {
      id
      nameEn
      nameFr
      organization {
        id
        nameEn
        nameFr
        acronymEn
        acronymFr
      }
    }
  }
}`;

const modifyProfileMutation = gql`
mutation modifyPr($gcID: String!, $profileInfo: ModifyProfileInput!) {
  modifyProfile(gcId: $gcID, profileInfo: $profileInfo) {
    gcID
  }
}
`;

export class OnboardStep5 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      supEdit: true,
      orgEdit: true,
    };

    this.editSup = this.editSup.bind(this);
    this.editOrg = this.editOrg.bind(this);
  }

  editSup() {
    this.setState(prevState => ({
      supEdit: !prevState.supEdit,
    }));
  }

  editOrg() {
    this.setState(prevState => ({
      orgEdit: !prevState.orgEdit,
    }));
  }

  render() {
    const {
      userObject,
      token,
    } = this.props;
    return (
      <Query
        variables={{ gcID: (String(userObject.gcID)) }}
        query={orgTeamQuery}
      >
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return `Error! ${error.message}`;
          const orgTest = data.profiles[0].org;
          const supTest = data.profiles[0].supervisor;
          return (
            <div>
              <h1 className="h3 border-bottom mb-2 pb-2">
                {__('Step5T1')}
              </h1>
              <Row className="mb-2">
                <Col>
                  <p>{__('Step5D1')}</p>
                  <p>{__('Step5D2')}</p>
                </Col>
              </Row>
              <Row>
                <Col md="6" className="mt-2">
                  {(() => {
                    if (this.state.supEdit) {
                      return (
                        <Mutation
                          mutation={modifyProfileMutation}
                          refetchQueries={[{
                            query: orgTeamQuery,
                            variables: { gcID: String(userObject.gcID) },
                          }]}
                          context={{
                            headers: {
                              Authorization:
                                `Bearer ${token}`,
                            },
                          }
                          }
                        >
                          {modifyProfile => (
                            <div className="onboard-profile">
                              {__('Supervisor')}
                              <SupervisorPicker
                                onResultSelect={(s) => {
                                modifyProfile({
                                  variables: {
                                    gcID: String(userObject.gcID),
                                    profileInfo: {
                                      supervisor: {
                                        gcId: s,
                                      },
                                    },
                                  },
                                });
                                this.editSup(this.state.supEdit);
                              }}
                              />
                            </div>
                          )}
                        </Mutation>
                      );
                    }
                    return (
                      <div className="d-flex">
                        <div>
                          {supTest ? supTest.name : ''}
                        </div>
                        <div className="ml-auto">
                          <Button
                            onClick={this.editSup}
                          >
                            Chng
                          </Button>
                        </div>
                      </div>
                    );
                  })()}
                </Col>
                <Col md="6" className="mt-2">
                  {(() => {
                    if (this.state.orgEdit) {
                      return (
                        <Mutation
                          mutation={modifyProfileMutation}
                          refetchQueries={[{
                            query: orgTeamQuery,
                            variables: { gcID: String(userObject.gcID) },
                          }]}
                          context={{
                            headers: {
                              Authorization:
                                `Bearer ${token}`,
                            },
                          }
                          }
                        >
                          {modifyProfile => (
                            <div>
                              {__('Teams')}
                              <TeamPicker
                                id="idTest"
                                editMode
                                selectedOrgTier={orgTest}
                                supervisor={supTest}
                                gcID={userObject.gcID}
                                onTeamChange={(t) => {
                                  this.editOrg(this.state.orgEdit);
                                  modifyProfile({
                                    variables: {
                                      gcID: String(userObject.gcID),
                                      profileInfo: {
                                        org: {
                                          orgTierId: t,
                                        },
                                      },
                                    },
                                  });
                                }}
                              />
                            </div>
                          )}
                        </Mutation>
                      );
                    }
                    return (
                      <div className="d-flex">
                        <div>
                          {orgTest ? orgTest.nameEn : ''}
                        </div>
                        <div className="ml-auto">
                          <Button
                            onClick={this.editOrg}
                          >
                            Chng
                          </Button>
                        </div>
                      </div>
                    );
                  })()}


                </Col>
              </Row>
              <Row className="m-2 border-top">
                <div className="ml-auto mt-3">
                  <Button
                    onClick={this.props.previousStep}
                    color="primary"
                  >
                    {__('Back')}
                  </Button>
                  <Button
                    onClick={this.props.nextStep}
                    color="primary"
                    className="ml-3"
                  >
                    {__('Next')}
                  </Button>
                </div>
              </Row>
            </div>
          );
        }}

      </Query>
    );
  }
}

OnboardStep5.defaultProps = {
  userObject: {},
  nextStep: undefined,
  previousStep: undefined,
};

OnboardStep5.propTypes = {
  userObject: PropTypes.shape({
    gcID: PropTypes.string,
  }),
  token: PropTypes.string.isRequired,
  nextStep: PropTypes.func,
  previousStep: PropTypes.func,
};

export default LocalizedComponent(OnboardStep5);
