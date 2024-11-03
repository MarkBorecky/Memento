import React, { useEffect, useState } from "react";
import { Avatar, Tabs } from "antd";
import { getAvatarColor } from "../../util/Colors";
import { formatDate } from "../../util/Helper";
import LoadingIndicator from "../../common/LoadingIndicator";
import "./Profile.css";
import NotFound from "../../common/NotFound";
import ServerError from "../../common/ServerError";
import { useParams } from "react-router-dom";

const { TabPane } = Tabs;

export interface User {
  id: number,
  name: string;
}

interface ProfileProps {
  currentUser: User | null;
  isAuthenticated: boolean;
}

const Profile: React.FC<ProfileProps> = () => {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [serverError, setServerError] = useState<boolean>(false);

  const loadUserProfile = async (username: string) => {
    setIsLoading(true);
    try {
      const response = null//await getUserProfile(username);
      setUser(response);
      setNotFound(false);
      setServerError(false);
    } catch (error) {
      const apiError = error as { status: number }
      if (apiError.status === 404) {
        setNotFound(true);
      } else {
        setServerError(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      loadUserProfile(username);
    }
  }, [username]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (notFound) {
    return <NotFound />;
  }

  if (serverError) {
    return <ServerError />;
  }

  const tabBarStyle = {
    textAlign: "center",
  };

  return (
    <div className="profile">
      {user && (
        <div className="user-profile">
          <div className="user-details">
            <div className="user-avatar">
              <Avatar
                className="user-avatar-circle"
                style={{ backgroundColor: getAvatarColor(user.name) }}
              >
                {user.name[0].toUpperCase()}
              </Avatar>
            </div>
            <div className="user-summary">
              <div className="full-name">{user.name}</div>
              <div className="username">@{user.username}</div>
              <div className="user-joined">
                Joined {formatDate(user.joinedAt)}
              </div>
            </div>
          </div>
          <div className="user-poll-details">
            <Tabs
              defaultActiveKey="1"
              animated={false}
              tabBarStyle={{ textAlign: 'center' }} // Use inline styling
              size="large"
              className="profile-tabs"
            ></Tabs>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
