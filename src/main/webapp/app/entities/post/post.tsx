import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { byteSize, Translate, TextFormat, getSortState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC, SORT } from 'app/shared/util/pagination.constants';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './post.reducer';

export const Post = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const postList = useAppSelector(state => state.post.entities);
  const loading = useAppSelector(state => state.post.loading);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        sort: `${sortState.sort},${sortState.order}`,
      }),
    );
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?sort=${sortState.sort},${sortState.order}`;
    if (pageLocation.search !== endURL) {
      navigate(`${pageLocation.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [sortState.order, sortState.sort]);

  const sort = p => () => {
    setSortState({
      ...sortState,
      order: sortState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handleSyncList = () => {
    sortEntities();
  };

  const getSortIconByFieldName = (fieldName: string) => {
    const sortFieldName = sortState.sort;
    const order = sortState.order;
    if (sortFieldName !== fieldName) {
      return faSort;
    } else {
      return order === ASC ? faSortUp : faSortDown;
    }
  };

  return (
    <div>
      <h2 id="post-heading" data-cy="PostHeading">
        <Translate contentKey="myApp.post.home.title">Posts</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} /> <Translate contentKey="myApp.post.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/post/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="myApp.post.home.createLabel">Create new Post</Translate>
          </Link>
        </div>
      </h2>
      Filter next meeting
      <div className="table-responsive">
        {postList && postList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="myApp.post.id">ID</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('date')}>
                  <Translate contentKey="myApp.post.date">Date</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('date')} />
                </th>
                <th className="hand" onClick={sort('title')}>
                  <Translate contentKey="myApp.post.title">Title</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('title')} />
                </th>
                <th className="hand" onClick={sort('content')}>
                  <Translate contentKey="myApp.post.content">Content</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('content')} />
                </th>
                <th className="hand" onClick={sort('published')}>
                  <Translate contentKey="myApp.post.published">Published</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('published')} />
                </th>
                <th>
                  <Translate contentKey="myApp.post.user">User</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {postList.map((post, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/post/${post.id}`} color="link" size="sm">
                      {post.id}
                    </Button>
                  </td>
                  <td>{post.date ? <TextFormat type="date" value={post.date} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{post.title}</td>
                  <td>{post.content}</td>
                  <td>{post.published ? 'true' : 'false'}</td>
                  <td>{post.user ? post.user.login : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/post/${post.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`/post/${post.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        onClick={() => (window.location.href = `/post/${post.id}/delete`)}
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="myApp.post.home.notFound">No Posts found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Post;
