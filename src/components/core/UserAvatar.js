import React from 'react';
import PropTypes from 'prop-types';

// import { Query, Mutation } from 'react-apollo';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';

const mapStateToProps = ({ user }) => {
  const props = {};
  if (user) {
    props.accessToken = user.access_token;
    props.myGcID = user.profile.sub;
  }
  return props;
};

export const UserAvatar = (props) => {
  const {
    myGcID,
    accessToken,
    edit,
    name,
    avatar,
    gcID,
  } = props;
  const canEdit = (accessToken !== '') && edit && (gcID === myGcID);

  const avatarComp = (canEdit) ? (
    <div>
      <div className="query">
        {(() => {
          if (avatar) {
            return (
              <div>
                <img
                  src={avatar}
                  alt={name}
                />
              </div>
            );
          }
          return (
            <div>
              No AVATAR
            </div>
          );
          })()}

        <div className="mutate">
          <Button>
            <label htmlFor="avatarUploadTest">
              Upload
              <input
                type="file"
                id="avatarUploadTest"
                style={{ display: 'none' }}
                required
                onChange={({ target }) => {
                  const reader = new FileReader();
                  reader.readAsDataURL(target.files[0]);
                }}
              />
            </label>
          </Button>
        </div>
      </div>
    </div>
  ) : (
    <div>{(() => {
      if (avatar) {
        return (
          <div>
            <img
              src={avatar}
              alt={name}
            />
          </div>
        );
      }
      return (
        <div>
          No AVATAR
        </div>
      );
      })()}
    </div>
  );
  return (
    <div>
      {avatarComp}
    </div>
  );
};

UserAvatar.defaultProps = {
  edit: false,
  name: 'No photo',
  gcID: '',
  accessToken: '',
  myGcID: '',
  avatar: 'https://avatars0.githubusercontent.com/u/7603237?s=460&v=4',
};

UserAvatar.propTypes = {
  edit: PropTypes.bool,
  gcID: PropTypes.string,
  name: PropTypes.string,
  avatar: PropTypes.string,
  accessToken: PropTypes.string,
  myGcID: PropTypes.string,
};

export default connect(mapStateToProps)(UserAvatar);

