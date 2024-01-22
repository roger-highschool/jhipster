import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IUser } from 'app/shared/model/user.model';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { IPost } from 'app/shared/model/post.model';
import { getEntities as getPosts } from 'app/entities/post/post.reducer';
import { IComment } from 'app/shared/model/comment.model';
import { getEntity, updateEntity, createEntity, reset } from './comment.reducer';

export const CommentUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const users = useAppSelector(state => state.userManagement.users);
  const posts = useAppSelector(state => state.post.entities);
  const commentEntity = useAppSelector(state => state.comment.entity);
  const loading = useAppSelector(state => state.comment.loading);
  const updating = useAppSelector(state => state.comment.updating);
  const updateSuccess = useAppSelector(state => state.comment.updateSuccess);

  const handleClose = () => {
    navigate('/comment');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getUsers({}));
    dispatch(getPosts({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  // eslint-disable-next-line complexity
  const saveEntity = values => {
    if (values.id !== undefined && typeof values.id !== 'number') {
      values.id = Number(values.id);
    }
    values.date = convertDateTimeToServer(values.date);

    const entity = {
      ...commentEntity,
      ...values,
      user: users.find(it => it.id.toString() === values.user.toString()),
      post: posts.find(it => it.id.toString() === values.post.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {
          date: displayDefaultDateTime(),
        }
      : {
          ...commentEntity,
          date: convertDateTimeFromServer(commentEntity.date),
          user: commentEntity?.user?.id,
          post: commentEntity?.post?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="myApp.comment.home.createOrEditLabel" data-cy="CommentCreateUpdateHeading">
            <Translate contentKey="myApp.comment.home.createOrEditLabel">Create or edit a Comment</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? (
                <ValidatedField
                  name="id"
                  required
                  readOnly
                  id="comment-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('myApp.comment.date')}
                id="comment-date"
                name="date"
                data-cy="date"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                label={translate('myApp.comment.content')}
                id="comment-content"
                name="content"
                data-cy="content"
                type="textarea"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('myApp.comment.published')}
                id="comment-published"
                name="published"
                data-cy="published"
                check
                type="checkbox"
              />
              <ValidatedField id="comment-user" name="user" data-cy="user" label={translate('myApp.comment.user')} type="select">
                <option value="" key="0" />
                {users
                  ? users.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.login}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField id="comment-post" name="post" data-cy="post" label={translate('myApp.comment.post')} type="select">
                <option value="" key="0" />
                {posts
                  ? posts.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.title}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/comment" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default CommentUpdate;
