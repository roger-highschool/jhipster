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

import { getEntities } from './comment.reducer';

export const Comment = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const commentList = useAppSelector(state => state.comment.entities);
  const loading = useAppSelector(state => state.comment.loading);

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
      <h2 id="comment-heading" data-cy="CommentHeading">
        <Translate contentKey="myApp.comment.home.title">Comments</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="myApp.comment.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/comment/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="myApp.comment.home.createLabel">Create new Comment</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {commentList && commentList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="myApp.comment.id">ID</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('date')}>
                  <Translate contentKey="myApp.comment.date">Date</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('date')} />
                </th>
                <th className="hand" onClick={sort('content')}>
                  <Translate contentKey="myApp.comment.content">Content</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('content')} />
                </th>
                <th className="hand" onClick={sort('published')}>
                  <Translate contentKey="myApp.comment.published">Published</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('published')} />
                </th>
                <th>
                  <Translate contentKey="myApp.comment.user">User</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="myApp.comment.post">Post</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {commentList.map((comment, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/comment/${comment.id}`} color="link" size="sm">
                      {comment.id}
                    </Button>
                  </td>
                  <td>{comment.date ? <TextFormat type="date" value={comment.date} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{comment.content}</td>
                  <td>{comment.published ? 'true' : 'false'}</td>
                  <td>{comment.user ? comment.user.login : ''}</td>
                  <td>{comment.post ? <Link to={`/post/${comment.post.id}`}>{comment.post.title}</Link> : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/comment/${comment.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`/comment/${comment.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        onClick={() => (window.location.href = `/comment/${comment.id}/delete`)}
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
              <Translate contentKey="myApp.comment.home.notFound">No Comments found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Comment;
